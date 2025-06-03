'use client';

import { useEffect, useState } from 'react';
import LengthSlider from './LengthSlider';
import OptionToggle from '../UI/OptionToggle';
import Button from '../UI/Button';
import Result from '../UI/Result';
import GoBack from '../UI/GoBack';

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState<number>(12);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(false);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(false);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [excludeSimilarCharacters, setExcludeSimilarCharacters] =
    useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  function generateCryptographicallySecurePassword(
    length: number = passwordLength,
    options: {
      includeUppercase?: boolean;
      includeLowercase?: boolean;
      includeNumbers?: boolean;
      includeSymbols?: boolean;
      excludeSimilarCharacters?: boolean;
    } = {}
  ): string {
    const {
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeSimilarCharacters = true,
    } = options;

    let chars = '';

    const uppercase = excludeSimilarCharacters
      ? 'ABCDEFGHJKLMNPQRSTUVWXYZ'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = excludeSimilarCharacters
      ? 'abcdefghijkmnopqrstuvwxyz'
      : 'abcdefghijklmnopqrstuvwxyz';
    const numbers = excludeSimilarCharacters ? '23456789' : '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars.length === 0) {
      setError('At least one character set must be selected');
    } else {
      setError(null);
    }

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(randomValues[i] % chars.length);
    }

    const requiredChars = [];
    if (includeUppercase)
      requiredChars.push(
        uppercase.charAt(
          crypto.getRandomValues(new Uint32Array(1))[0] % uppercase.length
        )
      );
    if (includeLowercase)
      requiredChars.push(
        lowercase.charAt(
          crypto.getRandomValues(new Uint32Array(1))[0] % lowercase.length
        )
      );
    if (includeNumbers)
      requiredChars.push(
        numbers.charAt(
          crypto.getRandomValues(new Uint32Array(1))[0] % numbers.length
        )
      );
    if (includeSymbols)
      requiredChars.push(
        symbols.charAt(
          crypto.getRandomValues(new Uint32Array(1))[0] % symbols.length
        )
      );

    if (requiredChars.length > 0) {
      for (let i = 0; i < requiredChars.length; i++) {
        password =
          password.substring(0, i) +
          requiredChars[i] +
          password.substring(i + 1);
      }

      const shuffled = shuffleSecurely(password.split(''));
      password = shuffled.join('');
    }

    return password;
  }

  function shuffleSecurely<T>(array: T[]): T[] {
    const result = [...array];
    const randomValues = new Uint32Array(result.length);
    crypto.getRandomValues(randomValues);

    for (let i = result.length - 1; i > 0; i--) {
      const j = randomValues[result.length - 1 - i] % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  const handleChange = (value: number) => {
    setPasswordLength(value);
  };

  return (
    <div className='w-[384px] relative'>
      <GoBack label='Back' className='mb-4 max-w-fit' />
      <form className='card'>
        <h1 className='text-3xl font-bold mb-4'>Password Generator</h1>
        <div className='card mb-4 flex flex-col gap-4'>
          <h2 className='font-medium text-md'>
            Choose at least one character set:
          </h2>
          <OptionToggle
            option={includeLowercase}
            setOption={setIncludeLowercase}
            label='Include Lowercase'
          />
          <OptionToggle
            option={includeUppercase}
            setOption={setIncludeUppercase}
            label='Include Uppercase'
          />
          <OptionToggle
            option={includeNumbers}
            setOption={setIncludeNumbers}
            label='Include Numbers'
          />
          <OptionToggle
            option={includeSymbols}
            setOption={setIncludeSymbols}
            label='Include Symbols'
          />
        </div>
        <div className='card mb-4'>
          <OptionToggle
            option={excludeSimilarCharacters}
            setOption={setExcludeSimilarCharacters}
            label='Exclude Similar Characters'
          />
        </div>
        <LengthSlider
          passwordLength={passwordLength}
          handleChange={handleChange}
        />
        <Button
          onClick={() => {
            setPassword(
              generateCryptographicallySecurePassword(passwordLength, {
                includeUppercase,
                includeLowercase,
                includeNumbers,
                includeSymbols,
                excludeSimilarCharacters,
              })
            );
          }}
          text='Generate Password'
          className='mt-4'
        />
      </form>
      <Result result={password} />
      {error && (
        <span className='absolute text-martian font-medium text-sm mt-2 text-center w-full block'>
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordGenerator;
