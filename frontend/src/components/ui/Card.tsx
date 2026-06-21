import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-default ${className}`}
    >
      {children}
    </div>
  );
}