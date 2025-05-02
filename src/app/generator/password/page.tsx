import PasswordGenerator from '@/components/password/PasswordGenerator';

const page = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen container mx-auto'>
      <PasswordGenerator />
    </div>
  );
};

export default page;
