import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const THUMBNAIL_MAX = 800;

function getOptimalFormat(
  originalFormat: string,
  targetFormat: string
): string {
  if (targetFormat !== 'auto') {
    return targetFormat;
  }

  switch (originalFormat.toLowerCase()) {
    case 'image/png':
      return 'webp';
    case 'image/gif':
      return 'webp';
    case 'image/jpeg':
    case 'image/jpg':
      return 'webp';
    default:
      return 'webp';
  }
}

function getSharpFormat(format: string): keyof sharp.FormatEnum {
  switch (format) {
    case 'webp':
      return 'webp';
    case 'avif':
      return 'avif';
    case 'jpeg':
      return 'jpeg';
    case 'png':
      return 'png';
    default:
      return 'webp';
  }
}

function calculateOptimalSize(
  width: number,
  height: number
): { width: number; height: number } {
  if (width <= THUMBNAIL_MAX && height <= THUMBNAIL_MAX) {
    return { width, height };
  }

  const aspectRatio = width / height;

  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    if (aspectRatio > 1) {
      return {
        width: Math.min(width, MAX_WIDTH),
        height: Math.round(Math.min(width, MAX_WIDTH) / aspectRatio),
      };
    } else {
      return {
        width: Math.round(Math.min(height, MAX_HEIGHT) * aspectRatio),
        height: Math.min(height, MAX_HEIGHT),
      };
    }
  }

  return { width, height };
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Please use images smaller than 20MB.' },
        { status: 413 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const targetFormat = (formData.get('format') as string) || 'auto';
    const quality = parseInt(formData.get('quality') as string) || 85;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    if (imageFile.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Please use images smaller than 20MB.' },
        { status: 413 }
      );
    }

    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image file.' },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const originalSize = imageBuffer.length;

    const metadata = await sharp(imageBuffer).metadata();
    const originalFormat = imageFile.type;
    const optimalFormat = getOptimalFormat(originalFormat, targetFormat);
    const sharpFormat = getSharpFormat(optimalFormat);

    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;
    const { width: targetWidth, height: targetHeight } = calculateOptimalSize(
      originalWidth,
      originalHeight
    );

    let pipeline = sharp(imageBuffer)
      .resize(targetWidth, targetHeight, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      })
      .withMetadata();

    switch (sharpFormat) {
      case 'webp':
        pipeline = pipeline.webp({
          quality,
          effort: 6,
          smartSubsample: true,
        });
        break;

      case 'avif':
        pipeline = pipeline.avif({
          quality,
          effort: 6,
          chromaSubsampling: '4:2:0',
        });
        break;

      case 'jpeg':
        pipeline = pipeline.jpeg({
          quality,
          progressive: true,
          mozjpeg: true,
          optimizeScans: true,
          quantizationTable: 0,
        });
        break;

      case 'png':
        pipeline = pipeline.png({
          quality,
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: metadata.channels === 4 ? false : true,
        });
        break;
    }

    const optimizedBuffer = await pipeline.toBuffer();
    const optimizedSize = optimizedBuffer.length;

    const reduction = Math.round(
      ((originalSize - optimizedSize) / originalSize) * 100
    );
    const compressionRatio = `${
      Math.round((originalSize / optimizedSize) * 10) / 10
    }:1`;

    const originalName = imageFile.name.split('.')[0] || 'optimized';
    const extension = sharpFormat === 'jpeg' ? 'jpg' : sharpFormat;
    const filename = `${originalName}-web-optimized.${extension}`;

    const response = new NextResponse(optimizedBuffer, {
      status: 200,
      headers: {
        'Content-Type': `image/${sharpFormat}`,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Original-Size': originalSize.toString(),
        'X-Optimized-Size': optimizedSize.toString(),
        'X-Size-Reduction': `${reduction}%`,
        'X-Compression-Ratio': compressionRatio,
        'X-Format': sharpFormat,
        'X-Original-Format': originalFormat.split('/')[1] || 'unknown',
        'Cache-Control': 'no-cache',
      },
    });

    return response;
  } catch (error) {
    console.error('Image optimization error:', error);

    if (error instanceof Error) {
      if (error.message.includes('unsupported image format')) {
        return NextResponse.json(
          {
            error:
              'Unsupported image format. Please use JPEG, PNG, WebP, or AVIF.',
          },
          { status: 400 }
        );
      }
      if (
        error.message.includes('Input buffer contains unsupported image format')
      ) {
        return NextResponse.json(
          { error: 'Invalid or corrupted image file.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          'Failed to process image. Please try again with a different image.',
      },
      { status: 500 }
    );
  }
}
