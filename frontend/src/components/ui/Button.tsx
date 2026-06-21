import React from "react";

interface ButtonProps {
  label?: string;
  children?: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled = false,
}) => {
  const baseStyle =
    "px-6 py-3 rounded-lg font-bold transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyle =
    variant === "primary"
      ? "bg-emerald-700 text-white hover:bg-emerald-800 shadow-md"
      : "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {label || children}
    </button>
  );
};

export default Button;