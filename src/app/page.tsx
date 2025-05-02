import Link from 'next/link';
import {
  generatorRoutes,
  optimisationRoutes,
  verificationRoutes,
} from './routes';

export default function Home() {
  return (
    <div className='container mx-auto flex items-center justify-center min-h-screen flex-col'>
      <h1 className='font-bold text-5xl mb-10'>Qheuss's Toolbox</h1>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col'>
          <h2 className='font-medium text-3xl'>Generate</h2>
          <div className='flex gap-10'>
            {generatorRoutes.map((route, i) => (
              <Link href={route.path} key={i}>
                <span className={`${route.color}`}>{route.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className='flex flex-col'>
          <h2 className='font-medium text-3xl'>Optimisation</h2>
          <div className='flex gap-10'>
            {optimisationRoutes.map((route, i) => (
              <Link href={route.path} key={i}>
                <span className={`${route.color}`}>{route.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className='flex flex-col'>
          <h2 className='font-medium text-3xl'>Verification</h2>
          <div className='flex gap-10'>
            {verificationRoutes.map((route, i) => (
              <Link href={route.path} key={i}>
                <span className={`${route.color}`}>{route.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
