import { useState, useRef, useEffect } from 'react';
import { getSpaceColorClass, type SpaceColor } from '@/utils/colorHelpers';

interface CustomSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  color?: SpaceColor;
}

const Select = ({
  options,
  value,
  onChange,
  color = 'cosmic',
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className='relative' ref={selectRef}>
      <button
        type='button'
        className={`flex items-center justify-between px-4 py-2 border border-space-border rounded-md bg-space-midnight text-space-text min-w-[120px] cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label || 'Select an option'}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className={`h-5 w-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          } ${getSpaceColorClass(color)}`}
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute z-10 mt-1 border border-space-border rounded-md bg-space-darker shadow-lg'>
          <ul className='py-1 min-w-[120px]'>
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-space-dark whitespace-normal break-words w-full ${
                  option.value === value
                    ? getSpaceColorClass(color)
                    : 'text-space-text'
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
