"use client";

import { forwardRef } from "react";

interface SelectOption {
  id: number | string;
  name: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  placeholder?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, name, options = [], placeholder = "Select option", error, ...rest },
  ref,
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        ref={ref}
        {...rest}
        className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
});

export default Select;
