import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SignInBannerProps {
  onSignIn: () => void;
  user: any; // Replace with your user type if available
}

const LOCALSTORAGE_KEY = "hideSignInBanner";

export const SignInBanner: React.FC<SignInBannerProps> = ({ onSignIn, user }) => {
  // Always visible if user is not signed in
  if (user) return null;

  return (
    <div
      className="w-full max-w-full flex flex-col sm:flex-row items-center justify-between bg-blue-50 dark:bg-gray-900 border border-blue-200 dark:border-yellow-400 rounded-md px-2 sm:px-4 py-2 mt-1 mb-2 shadow-md gap-1 sm:gap-2"
      style={{ animation: 'fadeIn 0.5s' }}
    >
      <span
        className="flex-1 text-blue-900 dark:text-yellow-300 text-center sm:text-left break-words font-medium text-sm sm:text-base leading-tight"
      >
        <span role="img" aria-label="sparkles" className="mr-1 text-lg align-middle">✨</span>
        <strong className="font-semibold">Don't lose your streak!</strong> Sign in to <span className="font-semibold">save progress</span> and <span className="font-semibold">sync across devices</span>.
      </span>
      <Button
        variant="secondary"
        size="sm"
        className="flex items-center gap-1 flex-shrink-0 w-full sm:w-auto text-sm px-2 py-1"
        onClick={onSignIn}
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" className="-ml-1"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.22l6.86-6.86C36.68 2.7 30.7 0 24 0 14.82 0 6.73 5.4 2.69 13.32l7.98 6.2C12.2 13.1 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.02h12.42c-.54 2.9-2.18 5.36-4.66 7.02l7.2 5.6C43.98 37.1 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.08a14.5 14.5 0 0 1 0-8.16l-7.98-6.2A23.97 23.97 0 0 0 0 24c0 3.82.92 7.44 2.69 10.68l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.2-5.6c-2.01 1.36-4.6 2.18-8.69 2.18-6.38 0-11.8-3.6-13.33-8.58l-7.98 6.2C6.73 42.6 14.82 48 24 48z"/></g></svg>
        <span>Sign in</span>
      </Button>
      <style jsx>{`
        .dark .text-yellow-300 { text-shadow: 0 1px 2px #222; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}; 