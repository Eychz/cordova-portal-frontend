import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'button',
  className = '' 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative overflow-hidden bg-white text-red-600 border-2 border-red-600 px-6 py-2 rounded-full 
        transition-all duration-300 ease-in-out ${className}`}
    >
      <span className="absolute inset-0 bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
      <span className="relative z-10 group-hover:text-white transition-colors duration-500">{children}</span>
    </button>
  );
};

export default Button;