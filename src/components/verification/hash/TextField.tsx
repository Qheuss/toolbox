import Button from '@/components/UI/Button';
import { getSpaceColorClass, SpaceColor } from '@/utils/colorHelpers';
import { ChangeEvent } from 'react';

interface TextFieldProps {
  color?: SpaceColor;
  title?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  buttonLabel?: string;
  onButtonClick?: () => void;
  value?: string;
}

const TextField = ({
  color = 'cosmic',
  title,
  onChange,
  buttonLabel,
  onButtonClick,
  value,
}: TextFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
  };

  return (
    <label htmlFor='text-field' className='w-full'>
      {title && <span>{title}</span>}
      <div className='flex flex-col'>
        <input
          id='text-field'
          className={`w-full rounded-md border border-space-border p-2 ${getSpaceColorClass(
            color,
            'border',
            'focus'
          )}`}
          onChange={handleChange}
          value={value}
        />
        {buttonLabel && (
          <Button
            onClick={onButtonClick || (() => {})}
            text={buttonLabel}
            color={color}
            className='text-sm/3 mt-2'
          />
        )}
      </div>
    </label>
  );
};

export default TextField;
