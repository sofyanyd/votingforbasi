import React from "react";

interface InputProps {
  label: string;
  name: string;
  register: any; 
  error?: string;
  type?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ label, name, register, error, type = "text", placeholder }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name} className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        placeholder={placeholder || `Masukkan ${label.toLowerCase()}...`}
        className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7B1D3F] transition-all 
          ${error ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1 italic">* {error}</p>}
    </div>
  );
};

export default Input;