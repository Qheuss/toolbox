'use client';

import { Dispatch, SetStateAction, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HashAlgorithm } from './Hash';
import { getSpaceColorClass, SpaceColor } from '@/utils/colorHelpers';

interface DropzoneProps {
  onDropDependencies?: HashAlgorithm[] | any[];
  onDropTryCatch: (acceptedFiles: File[]) => void;
  setUploadedFiles: Dispatch<SetStateAction<File[]>>;
  maxFiles?: number;
  acceptedFileTypes?: string;
  className?: string;
  color?: SpaceColor;
}

function Dropzone({
  onDropDependencies = [],
  onDropTryCatch,
  setUploadedFiles,
  maxFiles = 1,
  acceptedFileTypes,
  className = '',
  color = 'cosmic',
}: DropzoneProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setUploadedFiles((prev) =>
        maxFiles === 1
          ? [acceptedFiles[0]]
          : [...prev, ...acceptedFiles].slice(0, maxFiles)
      );

      if (onDropTryCatch) {
        onDropTryCatch(acceptedFiles);
      }
    },
    [setUploadedFiles, onDropTryCatch, maxFiles, ...onDropDependencies]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: acceptedFileTypes ? { [acceptedFileTypes]: [] } : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer w-full h-25 flex items-center justify-center ${
        isDragActive
          ? `${getSpaceColorClass(color, 'border')} bg-space-dark/20`
          : 'border-space-border/60'
      } ${className}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className={`${getSpaceColorClass(color)}`}>Drop the file here...</p>
      ) : (
        <p>Drag & drop a file here, or click to select</p>
      )}
    </div>
  );
}

export default Dropzone;
