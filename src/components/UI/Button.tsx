import { getSpaceColorClass, SpaceColor } from '@/utils/colorHelpers';

interface ButtonProps {
  onClick: () => void;
  text: string;
  color?: SpaceColor;
  className?: string;
  disabled?: boolean;
}

const Button = ({
  onClick,
  text,
  color = 'cosmic',
  className,
  disabled,
}: ButtonProps) => {
  return (
    <button
      type='button'
      className={`button ${getSpaceColorClass(color, 'bg')} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
