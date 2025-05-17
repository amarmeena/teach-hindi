import React, { useEffect, useRef } from 'react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome!!!"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center text-center border-2 border-yellow-300">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-2xl font-bold mb-2 text-yellow-700 dark:text-yellow-300">Welcome!!!</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Ready to start your language journey?<br />
          Complete your first lesson to begin your streak and earn your first badge!
        </p>
        <div className="mb-4 text-blue-700 dark:text-blue-200 text-sm">
          <strong>Tip:</strong> Come back every day to build your streak and unlock fun badges!
        </div>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="mt-2 px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-yellow-600"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}; 