import React from 'react';
import style from './LengthSlider.module.scss';

interface LengthSliderProps {
  passwordLength: number;
  handleChange: (length: number) => void;
}

const LengthSlider = ({ passwordLength, handleChange }: LengthSliderProps) => {
  const percentage = (passwordLength / 128) * 100;

  const sliderStyle = {
    backgroundImage: `linear-gradient(to right, var(--color-cosmic) 0%, var(--color-cosmic) ${percentage}%, var(--color-space-border) ${percentage}%, var(--color-space-border) 100%)`,
  };

  return (
    <div className={style.slider + ' card'}>
      <label
        htmlFor='password-length'
        className='block text-space-text-secondary font-medium mb-4'
      >
        Password length:
      </label>

      <div className='relative w-40'>
        <div
          className='absolute bottom-full bg-cosmic text-white text-xs px-2 py-0.5 rounded transform -translate-x-1/2'
          style={{ left: `${percentage}%` }}
        >
          {passwordLength}
        </div>

        <input
          id='password-length'
          type='range'
          min='0'
          max='128'
          value={passwordLength}
          onChange={(e) => handleChange(parseInt(e.target.value, 10))}
          className={style.rangeCosmic}
          style={sliderStyle}
        />
      </div>
    </div>
  );
};

export default LengthSlider;
