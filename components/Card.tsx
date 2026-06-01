import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none p-6 ${className}`}>
      {title && <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>}
      {description && <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
      {children}
    </div>
  );
};

export default Card;