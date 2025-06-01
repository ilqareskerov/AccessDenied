
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-pasha-blue', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`animate-spin rounded-full border-solid border-current border-r-transparent ${sizeClasses[size]} ${color}`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className={`mt-2 ${color} text-sm`}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
