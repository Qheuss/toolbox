import { getSpaceColorClass, SpaceColor } from '@/utils/colorHelpers';
import React from 'react';

interface ToggleProps {
  option: boolean;
  setOption: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  disabled?: boolean;
  color?: SpaceColor;
}

const Toggle: React.FC<ToggleProps> = ({
  option,
  setOption,
  label,
  disabled = false,
  color = 'cosmic',
}) => {
  return (
    <label className='flex items-center justify-between w-full cursor-pointer'>
      <span className='text-sm font-medium text-space-text-secondary'>
        {label}
      </span>
      <button
        type='button'
        role='switch'
        aria-checked={option}
        disabled={disabled}
        onClick={() => setOption(!option)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${option ? getSpaceColorClass(color, 'bg') : 'bg-space-border'}
        `}
      >
        <span className='sr-only'>{label}</span>
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full 
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${option ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </label>
  );
};

export default Toggle;
