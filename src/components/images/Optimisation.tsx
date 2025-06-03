'use client';

import React, { useState } from 'react';
import Button from '../UI/Button';
import GoBack from '../UI/GoBack';
import Dropzone from '../UI/Dropzone';
import Select from '../UI/Select';

interface OptimizationResult {
  url: string;
  originalSize: number;
  optimizedSize: number;
  format: string;
  originalFormat: string;
  reduction: string;
  compressionRatio: string;
  filename: string;
}

const WebOptimisation = () => {
  const componentColor = 'supernova';

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>('auto');
  const [quality, setQuality] = useState<number>(85);

  const handleOptimize = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', uploadedFiles[0]);
      formData.append('format', targetFormat);
      formData.append('quality', quality.toString());

      const response = await fetch('/api/optimize-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to optimize image');
      }

      const originalSize = parseInt(
        response.headers.get('X-Original-Size') || '0'
      );
      const optimizedSize = parseInt(
        response.headers.get('X-Optimized-Size') || '0'
      );
      const reduction = response.headers.get('X-Size-Reduction') || '0%';
      const compressionRatio =
        response.headers.get('X-Compression-Ratio') || '1:1';
      const format = response.headers.get('X-Format') || 'unknown';
      const originalFormat =
        response.headers.get('X-Original-Format') || 'unknown';

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const contentDisposition =
        response.headers.get('Content-Disposition') || '';
      const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `optimized.${format}`;

      setResult({
        url,
        originalSize,
        optimizedSize,
        format,
        originalFormat,
        reduction,
        compressionRatio,
        filename,
      });
    } catch (err) {
      setError('Error optimizing image: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadOptimized = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.filename;
      link.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getQualityDescription = (q: number): string => {
    if (q >= 95) return 'Maximum (huge files)';
    if (q >= 90) return 'Excellent (large files)';
    if (q >= 85) return 'High (recommended)';
    if (q >= 75) return 'Good (balanced)';
    if (q >= 65) return 'Medium (small files)';
    return 'Low (very small files)';
  };

  const formatOptions = [
    { value: 'auto', label: 'Auto (smallest file)' },
    { value: 'webp', label: 'WebP (modern browsers)' },
    { value: 'avif', label: 'AVIF (latest browsers)' },
    { value: 'jpeg', label: 'JPEG (universal)' },
  ];

  const handleFormatChange = (value: string) => {
    setTargetFormat(value);
  };

  return (
    <div className='w-[400px] relative'>
      <GoBack label='Back' className='mb-4 max-w-fit' color={componentColor} />
      <form className='card' onSubmit={(e) => e.preventDefault()}>
        <h1 className='text-3xl font-bold mb-4'>Web Image Optimizer</h1>

        <div className='card mb-4 flex flex-col gap-4'>
          <h2 className='font-medium text-md'>Choose an image to optimize:</h2>
          <Dropzone
            onDropTryCatch={() => {}}
            setUploadedFiles={setUploadedFiles}
            color={componentColor}
            maxFiles={1}
          />
        </div>

        <div className='card mb-4 space-y-4'>
          <h3 className='font-medium text-md'>Optimization Settings:</h3>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Output Format:
            </label>

            <Select
              value={targetFormat}
              onChange={handleFormatChange}
              options={formatOptions}
              color={componentColor}
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Quality: {quality} - {getQualityDescription(quality)}
            </label>
            <input
              type='range'
              min='60'
              max='95'
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className='w-full'
            />
            <div className='flex justify-between text-xs text-gray-500 mt-1'>
              <span>Smaller files</span>
              <span>Better quality</span>
            </div>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className='card mb-4'>
            <h3 className='font-medium mb-2'>Original File:</h3>
            <p className='text-sm text-gray-600'>
              Name: {uploadedFiles[0].name}
            </p>
            <p className='text-sm text-gray-600'>
              Size: {formatFileSize(uploadedFiles[0].size)}
            </p>
            <p className='text-sm text-gray-600'>
              Type: {uploadedFiles[0].type}
            </p>
          </div>
        )}

        <Button
          onClick={handleOptimize}
          text={isProcessing ? 'Optimizing...' : 'Optimize Image'}
          className='mt-4 text-shadow-sm'
          color={componentColor}
          disabled={isProcessing || uploadedFiles.length === 0}
        />

        {result && (
          <div className='card mt-4'>
            <h3 className='font-medium mb-2 text-green-600'>
              Optimization Complete!
            </h3>
            <div className='grid grid-cols-2 gap-2 text-sm mb-3'>
              <div>
                <strong>Original:</strong> {formatFileSize(result.originalSize)}
              </div>
              <div>
                <strong>Optimized:</strong>{' '}
                {formatFileSize(result.optimizedSize)}
              </div>
              <div>
                <strong>Reduction:</strong> {result.reduction}
              </div>
              <div>
                <strong>Compression:</strong> {result.compressionRatio}
              </div>
              <div>
                <strong>From:</strong> {result.originalFormat.toUpperCase()}
              </div>
              <div>
                <strong>To:</strong> {result.format.toUpperCase()}
              </div>
            </div>

            <Button
              onClick={downloadOptimized}
              text='Download Web-Optimized Image'
              className='text-shadow-sm w-full'
              color={componentColor}
            />
          </div>
        )}
      </form>

      {error && (
        <div className='absolute text-red-500 font-medium text-sm mt-2 text-center w-full'>
          {error}
        </div>
      )}
    </div>
  );
};

export default WebOptimisation;
