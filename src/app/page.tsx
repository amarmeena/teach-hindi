"use client";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FiXCircle, FiArrowLeft, FiArrowRight, FiVolume2, FiUser } from "react-icons/fi";
import { MdSportsEsports } from "react-icons/md";
import ThemeToggle from "@/components/ThemeToggle";
import { Toast } from "@/components/ui/Toast";
import { SignInBanner } from "@/components/SignInBanner";
import { useSession, signIn, signOut } from "next-auth/react";

// Define a placeholder PracticeItem type for now
interface PracticeItem {
  question: string;
  answer: string;
  // Add more fields as needed
}

// Define types for course content
interface LessonContent {
  content: [string, string][];
  // Remove vocabulary and practice for now, as they are not present in course.json
}

function playHindiAudio(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    window.speechSynthesis.speak(utterance);
  }
}

export default function Home() {
  const [lessons, setLessons] = useState<string[]>([]);
  const [courseContent, setCourseContent] = useState<LessonContent[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Track which flashcards are flipped
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);
  // Add a ref and state for animation
  const streakRef = useRef<HTMLDivElement>(null);
  const [animateStreak, setAnimateStreak] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [streakAnimation, setStreakAnimation] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [streakLandingAnim, setStreakLandingAnim] = useState("");
  const [practiceMode, setPracticeMode] = useState(false);
  const { data: session } = useSession();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const motivationalMessages = {
    zero: [
      "Every journey begins with a single step! Start your streak today.",
      "Consistency is key! Begin your Hindi journey now.",
      "No better time to start than today!",
      "Your streak starts with one lesson. Let's go!"
    ],
    low: [
      "Great start! Keep going!",
      "You're building a habit!",
      "Day by day, you're getting better!"
    ],
    mid: [
      "You're on a roll!",
      "Keep up the momentum!",
      "Your dedication is paying off!"
    ],
    high: [
      "Amazing! You're on fire!",
      "Incredible consistency!",
      "You're a Hindi learning superstar!"
    ]
  };

  function calculateStreak() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const lastTimestamp = window.localStorage.getItem('lastActivityTimestamp');
    let currentStreak = parseInt(window.localStorage.getItem('currentStreak') || '0', 10);
    let highestStreak = parseInt(window.localStorage.getItem('highestStreak') || '0', 10);
    const today = new Date();
    let streakReset = false;
    let newRecord = false;

    if (!lastTimestamp) {
      currentStreak = 0;
    } else {
      const lastDate = new Date(parseInt(lastTimestamp, 10));
      const last = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        // Already counted today
      } else if (diffDays === 1) {
        currentStreak += 1;
        if (currentStreak > highestStreak) {
          highestStreak = currentStreak;
          newRecord = true;
        }
      } else {
        if (currentStreak > highestStreak) {
          highestStreak = currentStreak;
        }
        currentStreak = 1;
        streakReset = true;
      }
    }
    window.localStorage.setItem('currentStreak', currentStreak.toString());
    window.localStorage.setItem('highestStreak', highestStreak.toString());
    setStreak(currentStreak);
    setHighestStreak(highestStreak);

    if (streakReset) {
      setToast({ message: 'Streak lost! Start again and beat your record!', type: 'warning' });
    } else if (newRecord) {
      setToast({ message: `New record! ${highestStreak}-day streak!`, type: 'success' });
    }
  }

  useEffect(() => {
    calculateStreak();
  }, []);

  useEffect(() => {
    async function fetchCourseData() {
      const data = await import("../content/course.json");
      setLessons(data.default.lessons);
      // Transform content to [string, string][]
      const fixedContent = data.default.courseContent.map((lesson: any) => ({
        ...lesson,
        content: lesson.content.map((entry: any) => [entry[0] ?? "", entry[1] ?? ""] as [string, string]),
      }));
      setCourseContent(fixedContent);
    }
    fetchCourseData();
  }, []);

  // Reset flipped cards when lesson changes
  useEffect(() => {
    setFlipped({});
  }, [currentStep]);

  // Reset shown answers when lesson changes
  const handleLessonChange = (idx: number) => {
    setCurrentStep(idx);
  };

  // Helper to go to next/previous lesson with transition
  const storeLessonCompletionTimestamp = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('lastActivityTimestamp', Date.now().toString());
      calculateStreak();
    }
  };
  const goToNext = () => {
    if (currentStep < lessons.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
        storeLessonCompletionTimestamp();
      }, 200);
    }
  };
  const goToPrev = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
        storeLessonCompletionTimestamp();
      }, 200);
    }
  };
  // Helper to jump to a lesson with transition
  const jumpToLesson = (idx: number) => {
    if (idx !== currentStep) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(idx);
        setIsTransitioning(false);
      }, 200);
    }
  };

  // Bounce animation trigger on streak or highestStreak change
  useEffect(() => {
    if (streak > 0) {
      setAnimateStreak(true);
      const timeout = setTimeout(() => setAnimateStreak(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [streak, highestStreak]);

  // Determine streak color
  const getStreakColor = () => {
    if (streak >= 7 && streak === highestStreak && highestStreak >= 7) return "bg-yellow-300 border-yellow-500 text-yellow-900 dark:bg-yellow-400 dark:border-yellow-600 dark:text-yellow-900"; // gold
    if (streak >= 7) return "bg-green-200 border-green-500 text-green-900 dark:bg-green-400 dark:border-green-600 dark:text-green-900";
    if (streak >= 3) return "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200";
    if (streak >= 1) return "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200";
    return "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200";
  };

  useEffect(() => {
    let msg = "";
    if (streak === 0) {
      const arr = motivationalMessages.zero;
      msg = arr[Math.floor(Math.random() * arr.length)];
    } else if (streak <= 2) {
      const arr = motivationalMessages.low;
      msg = arr[Math.floor(Math.random() * arr.length)];
    } else if (streak <= 6) {
      const arr = motivationalMessages.mid;
      msg = arr[Math.floor(Math.random() * arr.length)];
    } else {
      const arr = motivationalMessages.high;
      msg = arr[Math.floor(Math.random() * arr.length)];
    }
    setMotivation(msg);
  }, [streak]);

  // Update streak animation on streak events
  useEffect(() => {
    if (toast?.type === 'success') {
      setStreakAnimation('streak-confetti');
      const timeout = setTimeout(() => setStreakAnimation(''), 700);
      return () => clearTimeout(timeout);
    } else if (toast?.type === 'warning') {
      setStreakAnimation('streak-shake');
      const timeout = setTimeout(() => setStreakAnimation(''), 500);
      return () => clearTimeout(timeout);
    } else if (streak >= 7) {
      setStreakAnimation('streak-glow');
    } else {
      setStreakAnimation('');
    }
  }, [toast, streak]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (!window.localStorage.getItem('isFirstVisit')) {
        setShowWelcome(true);
      }
    }
  }, []);

  // Trigger pop animation on first visit or streak start
  useEffect(() => {
    if (showWelcome || streak === 1) {
      setStreakLandingAnim('streak-pop');
      const timeout = setTimeout(() => setStreakLandingAnim(''), 700);
      return () => clearTimeout(timeout);
    }
  }, [showWelcome, streak]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  // Show sign-in modal on first load if not signed in
  useEffect(() => {
    if (!session || !session.user) {
      if (typeof window !== 'undefined' && window.localStorage && !window.localStorage.getItem('seenSignInModal')) {
        setShowSignInModal(true);
      }
    }
  }, [session]);

  const handleCloseSignInModal = () => {
    setShowSignInModal(false);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('seenSignInModal', 'true');
    }
  };

  if (lessons.length === 0 || courseContent.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <span className="text-lg text-gray-700 dark:text-gray-200">Loading course...</span>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Top Bar: Sidebar + Dark Mode Toggle + Profile */}
      <header className="w-full bg-white dark:bg-black text-black dark:text-white border-b border-gray-200 dark:border-gray-800">
        <div className="w-full flex items-center justify-between px-4 py-4">
          {/* Sidebar Toggle */}
          <button
            className="w-11 h-11 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700 bg-black text-white dark:bg-white dark:text-black focus:outline-none focus:ring-2 focus:ring-gray-400 active:scale-95 transition-transform"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Open course progress sidebar"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-white dark:text-black">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <span className="sr-only">Open course progress sidebar</span>
          </button>
          <div className="flex items-center gap-4">
            <ThemeToggle className="w-11 h-11" />
            {/* Profile Icon & Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                className="w-11 h-11 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setProfileMenuOpen((v) => !v)}
                aria-label="Open profile menu"
              >
                {session && session.user && session.user.image ? (
                  <img src={session.user.image} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
                ) : session && session.user && session.user.name ? (
                  <span className="font-bold text-lg">{session.user.name.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
                ) : (
                  <span className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 border-2 border-blue-300 shadow font-bold text-xl transition-transform hover:scale-105">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="10" r="4" fill="#60A5FA"/>
                      <path d="M6 18c0-2.21 3.134-4 6-4s6 1.79 6 4" fill="#60A5FA"/>
                    </svg>
                  </span>
                )}
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 animate-fade-in">
                  {session && session.user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <div className="font-semibold text-gray-900 dark:text-white">{session.user.name || session.user.email}</div>
                        {session.user.email && <div className="text-sm text-gray-500 dark:text-gray-300">{session.user.email}</div>}
                      </div>
                      <button
                        className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-b-xl font-semibold"
                        onClick={() => { setProfileMenuOpen(false); signOut(); }}
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 text-center">
                      <span className="block font-semibold mb-1">Don't lose your streak!</span>
                      <span className="block mb-2">Sign in to save progress and sync across devices.</span>
                      <Button onClick={() => { setProfileMenuOpen(false); signIn('google'); }} variant="secondary" size="sm" className="w-full">Sign in with Google</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-black font-sans overflow-x-hidden">
        {/* Collapsible Sidebar Overlay (all screens) */}
        {sidebarOpen && (
          <aside className="fixed inset-0 z-30 flex sidebar-overlay transition-all duration-300">
            <div className="sidebar-panel w-11/12 max-w-xs md:w-64 bg-white dark:bg-black text-gray-900 dark:text-white p-6 h-full flex flex-col transition-all duration-300 translate-x-0">
              <div className="flex items-center mb-6 justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Progress</h2>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700 bg-black text-white dark:bg-white dark:text-black ml-2"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <ol className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <li
                    key={lesson}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-base font-semibold cursor-pointer select-none min-h-[44px] shadow-sm
                      ${idx === currentStep
                      ? "bg-gray-900 text-white dark:bg-white dark:text-black border-2 border-gray-900 dark:border-white"
                      : "bg-white text-gray-900 border border-gray-300 dark:bg-black dark:text-white dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"}
                    `}
                    onClick={() => { jumpToLesson(idx); setSidebarOpen(false); }}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { jumpToLesson(idx); setSidebarOpen(false); } }}
                    aria-current={idx === currentStep ? 'step' : undefined}
                    aria-label={`Go to lesson: ${lesson}`}
                  >
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full font-bold min-w-[44px] min-h-[44px] text-base
                      ${idx === currentStep
                      ? "bg-white text-gray-900 border-2 border-gray-900 dark:bg-gray-900 dark:text-white dark:border-white"
                      : "bg-white text-gray-900 border border-gray-300 dark:bg-black dark:text-white dark:border-gray-700"}
                    `}>{idx + 1}</span>
                    <span>{lesson}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep + 1} of {lessons.length}
              </div>
            </div>
            {/* Backdrop */}
            <div className="flex-1 bg-black bg-opacity-30 dark:bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Auth UI */}
            <div className="mb-6 flex items-center gap-4">
              {/* Removed user status from here for focus */}
            </div>
            {showSignInModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 font-sans antialiased">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 max-w-md w-full flex flex-col items-center text-center border border-blue-200 dark:border-blue-700">
                  {/* Clean SVG lock icon */}
                  <svg className="w-12 h-12 mb-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="8" rx="3" fill="currentColor" className="text-blue-100 dark:text-blue-900"/>
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h2 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">Don't lose your streak!</h2>
                  <p className="mb-6 text-gray-700 dark:text-gray-200 text-base">
                    Sign in to <span className="font-semibold text-blue-700 dark:text-blue-300">save progress</span> and <span className="font-semibold text-blue-700 dark:text-blue-300">sync across devices</span>.
                  </p>
                  <Button
                    onClick={() => { handleCloseSignInModal(); signIn('google'); }}
                    variant="secondary"
                    size="lg"
                    className="mb-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors px-6 py-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block mr-2 align-middle"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.22l6.86-6.86C36.68 2.7 30.7 0 24 0 14.82 0 6.73 5.4 2.69 13.32l7.98 6.2C12.2 13.1 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.02h12.42c-.54 2.9-2.18 5.36-4.66 7.02l7.2 5.6C43.98 37.1 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.08a14.5 14.5 0 0 1 0-8.16l-7.98-6.2A23.97 23.97 0 0 0 0 24c0 3.82.92 7.44 2.69 10.68l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.14 15.89-5.82l-7.2-5.6c-2.01 1.36-4.6 2.18-8.69 2.18-6.38 0-11.8-3.6-13.33-8.58l-7.98 6.2C6.73 42.6 14.82 48 24 48z"/></g></svg>
                    Sign in with Google
                  </Button>
                  <button
                    onClick={handleCloseSignInModal}
                    className="mt-2 px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-blue-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-200 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            )}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
            {/* Streak Indicator */}
            <div
              ref={streakRef}
              className={`flex flex-col items-center justify-center mb-2 p-3 rounded-xl font-bold text-lg shadow-sm border transition-all duration-300 ${getStreakColor()} ${animateStreak ? 'animate-bounce' : ''} ${streakAnimation} ${streakLandingAnim}`}
              aria-label={`Current streak: ${streak} days`}
              tabIndex={0}
            >
              <div className="flex items-center">
                <span role="img" aria-label="fire" className={`mr-2 ${animateStreak ? 'animate-bounce' : ''}`}>🔥</span>
                <span className={animateStreak ? 'animate-bounce' : ''}>{streak > 0 ? `${streak}-day streak!` : 'Start your streak today!'}</span>
              </div>
              <div className="text-sm font-normal mt-1" aria-label={`Highest streak: ${highestStreak} days`}>
                Highest streak: {highestStreak}
              </div>
              <div className="text-sm font-medium mt-2 text-center text-blue-700 dark:text-blue-200" aria-live="polite">
                {motivation}
              </div>
            </div>
            {/* Lesson Card */}
            <div
              className={`mb-10 mt-10 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
              style={{ transitionProperty: 'opacity, transform' }}
            >
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-0 flex-1">{lessons[currentStep]}</h2>
              </div>
              {/* Content Section */}
              <div className="mb-6">
                {practiceMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseContent[currentStep].content.map(([hindi, english]: [string, string], i: number) => (
                      <div
                        key={i}
                        className={`relative cursor-pointer select-none rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 py-2 px-3 flex items-center justify-center min-h-[36px] text-base
                          ${flipped[i] ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-800'}`}
                        onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setFlipped(f => ({ ...f, [i]: !f[i] })); }}
                        aria-label={flipped[i] ? english : hindi}
                      >
                        <span className="font-semibold text-black dark:text-white transition-all duration-300 text-center w-full flex items-center justify-center gap-2">
                          {flipped[i] ? english : hindi}
                          <button
                            type="button"
                            tabIndex={0}
                            aria-label={`Pronounce ${flipped[i] ? english : hindi}`}
                            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 self-start mt-1"
                            onClick={e => { e.stopPropagation(); playHindiAudio(flipped[i] ? english : hindi); }}
                          >
                            <FiVolume2 className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseContent[currentStep].content.map(([hindi, english]: [string, string], i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-100 text-black border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-xl">
                        <span className="font-medium text-base text-left flex-1 flex items-center gap-2">
                          {hindi}
                          <button
                            type="button"
                            tabIndex={0}
                            aria-label={`Pronounce ${hindi}`}
                            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 self-start mt-1"
                            onClick={() => playHindiAudio(hindi)}
                          >
                            <FiVolume2 className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                          </button>
                        </span>
                        <span className="text-gray-500 dark:text-gray-300 text-base text-right flex-1">{english}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center gap-4">
              <Button
                onClick={goToPrev}
                disabled={currentStep === 0}
                className="rounded-full flex items-center justify-center min-w-[44px] md:w-44"
              >
                <span className="md:hidden"><FiArrowLeft className="w-5 h-5" /></span>
                <span className="hidden md:inline-flex items-center gap-x-2">Previous<FiArrowLeft className="w-5 h-5" /></span>
              </Button>

              <Button
                onClick={() => setPracticeMode((v) => !v)}
                className="rounded-full flex items-center justify-center min-w-[44px] md:w-44"
              >
                <span className="md:hidden"><MdSportsEsports className="w-5 h-5" /></span>
                <span className="hidden md:inline-flex items-center gap-x-2">{practiceMode ? 'Lesson Mode' : 'Quiz Mode'}<MdSportsEsports className="w-5 h-5" /></span>
              </Button>

              <Button
                onClick={goToNext}
                disabled={currentStep === lessons.length - 1}
                className="rounded-full flex items-center justify-center min-w-[44px] md:w-44"
              >
                <span className="md:hidden"><FiArrowRight className="w-5 h-5" /></span>
                <span className="hidden md:inline-flex items-center gap-x-2">Next<FiArrowRight className="w-5 h-5" /></span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
