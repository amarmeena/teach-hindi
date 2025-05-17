import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  onClose: () => void;
}

const typeColors = {
  success: 'bg-green-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-500 text-black',
  error: 'bg-red-500 text-white',
};

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${typeColors[type]} transition-all animate-fade-in`}
      style={{ minWidth: 220 }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="ml-4 text-lg font-bold focus:outline-none"
      >
        ×
      </button>
    </div>
  );
};

// Add a simple fade-in animation
// In your global CSS, add:
// @keyframes fade-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: none; } }
// .animate-fade-in { animation: fade-in 0.3s ease; } 