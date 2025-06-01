
import React from 'react';
import { Icons } from '../../constants';

interface AlertMessageProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onClose }) => {
  const baseClasses = "p-4 rounded-md flex items-start space-x-3";
  const typeClasses = {
    success: "bg-green-50 border border-green-300 text-green-700",
    error: "bg-red-50 border border-red-300 text-red-700",
    info: "bg-blue-50 border border-blue-300 text-blue-700",
    warning: "bg-yellow-50 border border-yellow-300 text-yellow-700",
  };

  const IconComponent = {
    success: Icons.CheckCircle,
    error: Icons.ExclamationTriangle,
    info: Icons.InformationCircle,
    warning: Icons.ExclamationTriangle,
  }[type];

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <div className="flex-shrink-0">
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm ">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8"
          aria-label="Dismiss"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
