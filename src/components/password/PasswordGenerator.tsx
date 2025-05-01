'use client';

import { useState } from 'react';
import LengthSlider from './LengthSlider';

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState<number>(1);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(false);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(false);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [excludeSimilarCharacters, setExcludeSimilarCharacters] =
    useState<boolean>(false);

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
      throw new Error('At least one character set must be selected');
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
    <div className='card'>
      <LengthSlider
        passwordLength={passwordLength}
        handleChange={handleChange}
      />
    </div>
  );
};

export default PasswordGenerator;
