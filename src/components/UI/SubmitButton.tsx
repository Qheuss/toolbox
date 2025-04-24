import React from 'react';

interface SubmitButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  text: string;
}

const SubmitButton = ({ disabled, text, onClick }: SubmitButtonProps) => {
  return (
    <button disabled={disabled} onClick={onClick}>
      {text}
    </button>
  );
};

export default SubmitButton;
