import React from 'react';

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  name: string;
  type?: string;
  error?: {
    message: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string | number;
}

const TextField = ({
  label,
  placeholder,
  name,
  type = 'text',
  error,
  onChange,
  defaultValue,
}: TextFieldProps) => {
  return (
    <>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        defaultValue={defaultValue}
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      />
      {error && (
        <span className="text-red-500 text-sm mt-1">{error.message}</span>
      )}
    </>
  );
};

export default TextField;
