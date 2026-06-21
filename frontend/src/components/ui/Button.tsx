import React from "react";

interface ButtonProps {
  label?: string;
  children?: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}) => {
  // Ditambahkan font-bold, rounded-lg, dan cursor-pointer agar konsisten
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition-all duration-200 active:scale-95 cursor-pointer";
  
  // Mengubah skema warna dari Maroon (#7B1D3F) menjadi Biru Tailwind (blue-600)
  const variantStyle =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
      : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {label || children}
    </button>
  );
};

export default Button;