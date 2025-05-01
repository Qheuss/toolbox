import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface GoBackProps {
  label?: string;
  className?: string;
}

const GoBack = ({ label = 'Back', className = '' }: GoBackProps) => {
  return (
    <Link
      href='/'
      className={`flex items-center gap-2 text-space-text-secondary hover:text-cosmic transition-colors group cursor-pointer ${className}`}
      aria-label='Go back'
    >
      <span className='text-space-text-disabled group-hover:text-cosmic transition-colors'>
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
          <path d='M19 12H5' />
          <path d='M12 19l-7-7 7-7' />
        </svg>
      </span>
      {label && <span>{label}</span>}
    </Link>
  );
};

export default GoBack;
