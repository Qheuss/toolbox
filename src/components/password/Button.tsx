import { getSpaceColorClass, SpaceColor } from '@/utils/colorHelpers';

interface ButtonProps {
  onClick: () => void;
  text: string;
  color?: SpaceColor;
  className?: string;
}

const Button = ({
  onClick,
  text,
  color = 'cosmic',
  className,
}: ButtonProps) => {
  return (
    <button
      type='button'
      className={`button ${getSpaceColorClass(color, 'bg')} ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
