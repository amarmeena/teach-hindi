"use client";
import { useEffect, useState } from "react";
import type { ButtonHTMLAttributes } from "react";

interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function ThemeToggle({ className = "", ...props }: ThemeToggleProps) {
  // Always start as 'light' to match SSR
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // On mount, check localStorage, then system preference
  useEffect(() => {
    setMounted(true);
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Update html class and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={
        className
          ? className + " w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95 transition-transform bg-black text-white dark:bg-white dark:text-black"
          : "fixed top-4 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95 transition-transform bg-black text-white dark:bg-white dark:text-black"
      }
      {...props}
    >
      {theme === "dark" ? (
        // Filled sun icon
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><g stroke="#fbbf24"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="16.95" y1="7.05" x2="18.36" y2="5.64"/><line x1="7.05" y1="16.95" x2="5.64" y2="18.36"/><line x1="16.95" y1="16.95" x2="18.36" y2="18.36"/><line x1="7.05" y1="7.05" x2="5.64" y2="5.64"/></g></svg>
      ) : (
        // Filled moon icon (white for contrast)
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
      )}
    </button>
  );
} 