import { useState, useEffect } from 'react';
import { getSpaceColorClass, type SpaceColor } from '@/utils/colorHelpers';

interface ResultProps {
  result: string | null;
  text?: string;
  color?: SpaceColor;
}

const Result = ({ result, text, color = 'cosmic' }: ResultProps) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!result) return null;

  return (
    <div className='mt-4 flex flex-col items-center justify-center relative'>
      {text && (
        <h2 className='text-xl font-bold text-space-text mb-1'>{text}</h2>
      )}
      <button
        className='relative bg-space-midnight/80 pr-12 pl-5 py-3 rounded-md border border-space-border/60 w-full cursor-pointer group whitespace-normal break-words'
        onClick={handleCopy}
        aria-label='Copy to clipboard'
      >
        <span className='text-space-text-secondary'>{result}</span>
        <span
          className={`absolute right-4 top-[40%] text-space-text-disabled ${getSpaceColorClass(
            color,
            'text',
            'group-hover'
          )} transition-colors duration-200`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect>
            <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path>
          </svg>
        </span>
      </button>
      {isCopied && (
        <span
          className={`absolute mt-2 text-sm ${getSpaceColorClass(
            color
          )} font-medium top-[105%]`}
        >
          Copied to clipboard!
        </span>
      )}
    </div>
  );
};

export default Result;
