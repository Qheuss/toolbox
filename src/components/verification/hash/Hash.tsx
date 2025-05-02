'use client';

import GoBack from '@/components/password/GoBack';
import Result from '@/components/password/Result';
import { useCallback, useState, useEffect, ChangeEvent, use } from 'react';
import Select from './Select';
import Dropzone from './Dropzone';
import TextField from './TextField';

export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

function Hash() {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [result, setResult] = useState<{
    fileName: string;
    hash: string;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchingHash, setMatchingHash] = useState<string>('');

  const componentColor = 'pulsar';

  const calculateHash = async (
    file: File,
    algo: HashAlgorithm
  ): Promise<string> => {
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest(algo, buffer);

      return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      console.error('Hash calculation error:', error);
      throw error;
    }
  };

  const calculateHashFromText = async () => {
    if (!inputValue.trim()) return;

    setIsCalculating(true);
    setResult(null);

    try {
      const textFile = new File([inputValue], 'input field', {
        type: 'text/plain',
      });
      setUploadedFiles([textFile]);

      const hash = await calculateHash(textFile, algorithm);
      setResult({ fileName: textFile.name, hash });
    } catch (error) {
      console.error('Hash calculation failed:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const onDropTryCatch = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];
      setIsCalculating(true);
      setResult(null);
      setInputValue('');

      try {
        const hash = await calculateHash(file, algorithm);
        setResult({ fileName: file.name, hash });
      } catch (error) {
        console.error('Hash calculation failed:', error);
      } finally {
        setIsCalculating(false);
      }
    },
    [algorithm]
  );

  useEffect(() => {
    const recalculateHash = async () => {
      if (uploadedFiles.length === 0) return;

      setIsCalculating(true);
      setResult(null);

      try {
        const file = uploadedFiles[0];
        const hash = await calculateHash(file, algorithm);
        setResult({ fileName: file.name, hash });
      } catch (error) {
        console.error('Hash recalculation failed:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    recalculateHash();
  }, [algorithm, uploadedFiles]);

  useEffect(() => {
    if (result && matchingHash) {
      setIsMatching(result.hash === matchingHash);
    } else {
      setIsMatching(false);
    }
  }, [result, matchingHash]);

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value as HashAlgorithm);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const hashOptions = [
    { value: 'SHA-1', label: 'SHA-1' },
    { value: 'SHA-256', label: 'SHA-256' },
    { value: 'SHA-384', label: 'SHA-384' },
    { value: 'SHA-512', label: 'SHA-512' },
  ];

  return (
    <div className='w-[384px] relative'>
      <GoBack label='Back' className='mb-4 max-w-fit' color={componentColor} />

      <div className='card'>
        <h1 className='text-3xl font-bold mb-4'>Quick Hash</h1>
        <div className='mb-4'>
          <div className='card'>
            <label className='block mb-2 text-center'>Algorithm:</label>
            <Select
              value={algorithm}
              onChange={handleAlgorithmChange}
              options={hashOptions}
              color={componentColor}
            />
          </div>
        </div>
        <div className='card flex flex-col gap-2'>
          <TextField
            title='Text to hash (single line):'
            color={componentColor}
            onChange={handleInputChange}
            buttonLabel='Generate Hash'
            onButtonClick={calculateHashFromText}
            value={inputValue}
          />
          <span>Or</span>
          <Dropzone
            onDropDependencies={[algorithm]}
            onDropTryCatch={onDropTryCatch}
            setUploadedFiles={setUploadedFiles}
            color={componentColor}
            maxFiles={1}
          />
          <div className='w-full mt-2'>
            <TextField
              title='Hash value to match:'
              color={componentColor}
              value={matchingHash}
              onChange={(e) => setMatchingHash(e.target.value)}
            />
          </div>
        </div>
      </div>
      {isCalculating && <p className='mt-4'>Calculating {algorithm} hash...</p>}
      {result && (
        <div className='mt-4 '>
          <p className='whitespace-normal break-words'>
            File: {result.fileName}
          </p>
          <Result
            result={result.hash}
            color={componentColor}
            text={algorithm + ':'}
          />
          {isMatching && (
            <p className='mt-4 text-green-500 text-center'>Hash matches!</p>
          )}
          {!isMatching && matchingHash.length > 0 && (
            <p className='mt-4 text-red-500 text-center'>Hash don't match :(</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Hash;
