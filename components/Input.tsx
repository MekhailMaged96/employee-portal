"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, name, error, ...rest }: InputProps,
  ref: React.Ref<HTMLInputElement>,
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        ref={ref}
        {...rest}
        className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
});

export default Input;
