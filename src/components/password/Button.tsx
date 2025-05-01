interface ButtonProps {
  onClick: () => void;
  text: string;
  color?: string;
}

const Button = ({ onClick, text, color = 'cosmic' }: ButtonProps) => {
  return (
    <button
      type='button'
      className={`button bg-${color} mt-4`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
