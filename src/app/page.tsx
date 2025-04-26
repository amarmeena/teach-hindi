"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiXCircle, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { MdSportsEsports } from "react-icons/md";
import ThemeToggle from "@/components/ThemeToggle";

// Define types for course content
interface PracticeItem {
  prompt: string;
  question: string;
  answer: string;
}
interface LessonContent {
  vocabulary: [string, string][];
  practice: PracticeItem[];
}

export default function Home() {
  const [lessons, setLessons] = useState<string[]>([]);
  const [courseContent, setCourseContent] = useState<LessonContent[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Track which answers are shown for the current lesson
  const [shownAnswers, setShownAnswers] = useState<{ [key: number]: boolean }>({});
  // Practice mode state
  const [practiceMode, setPracticeMode] = useState(false);
  // Track which flashcards are flipped
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function fetchCourseData() {
      const data = await import("../content/hindi-course.json");
      setLessons(data.default.lessons);
      // Transform vocabulary to [string, string][]
      const fixedContent = data.default.courseContent.map((lesson: any) => ({
        ...lesson,
        vocabulary: lesson.vocabulary.map((entry: any) => [entry[0] ?? "", entry[1] ?? ""] as [string, string]),
      }));
      setCourseContent(fixedContent);
    }
    fetchCourseData();
  }, []);

  // Reset shown answers and flipped cards when lesson or mode changes
  useEffect(() => {
    setShownAnswers({});
    setFlipped({});
  }, [currentStep, practiceMode]);

  // Reset shown answers when lesson changes
  const handleLessonChange = (idx: number) => {
    setCurrentStep(idx);
    setShownAnswers({});
  };

  // Helper to go to next/previous lesson with transition
  const goToNext = () => {
    if (currentStep < lessons.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 200);
    }
  };
  const goToPrev = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
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
  // Toggle quiz mode with transition
  const togglePracticeMode = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPracticeMode((v) => !v);
      setIsTransitioning(false);
    }, 200);
  };

  // Toggle answer visibility for a practice question
  const toggleAnswer = (i: number) => {
    setShownAnswers((prev) => ({ ...prev, [i]: !prev[i] }));
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
      {/* Mobile Top Bar: Sidebar + Dark Mode Toggle */}
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
          {/* Dark Mode Toggle */}
          <ThemeToggle className="w-11 h-11" />
        </div>
      </header>
      <div className="min-h-screen flex bg-white dark:bg-black font-sans">
        {/* Collapsible Sidebar Overlay (all screens) */}
        {sidebarOpen && (
          <aside className="fixed inset-0 z-30 flex sidebar-overlay transition-all duration-300">
            <div className="sidebar-panel w-64 bg-white dark:bg-black text-gray-900 dark:text-white p-6 h-full flex flex-col transition-all duration-300 translate-x-0">
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
            {/* Lesson Card */}
            <div
              className={`mb-10 mt-10 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
              style={{ transitionProperty: 'opacity, transform' }}
            >
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-0 flex-1">{lessons[currentStep]}</h2>
              </div>
              {/* Vocabulary Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-black dark:text-white">Vocabulary</h3>
                {practiceMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseContent[currentStep].vocabulary.map(([hindi, english]: [string, string], i: number) => (
                      <div
                        key={i}
                        className={`relative cursor-pointer select-none rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 py-2 px-3 flex items-center justify-center min-h-[36px] text-base
                          ${flipped[i] ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-800'}`}
                        onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setFlipped(f => ({ ...f, [i]: !f[i] })); }}
                        aria-label={flipped[i] ? english : hindi}
                      >
                        <span className="font-semibold text-black dark:text-white transition-all duration-300 text-center w-full">
                          {flipped[i] ? english : hindi}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courseContent[currentStep].vocabulary.map(([hindi, english]: [string, string], i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-100 text-black border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-xl">
                        <span className="font-medium text-base text-left flex-1">{hindi}</span>
                        <span className="text-gray-500 dark:text-gray-300 text-base text-right flex-1">{english}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Navigation */}
            <div className="flex justify-between items-center gap-x-2 mt-6">
              {/* Previous Lesson Button */}
              <Button
                variant="secondary"
                onClick={goToPrev}
                disabled={currentStep === 0}
                className="rounded-full flex items-center justify-center min-w-[44px] md:w-44"
              >
                <span className="md:hidden"><FiArrowLeft className="w-5 h-5" /></span>
                <span className="hidden md:inline-flex items-center gap-x-2"><FiArrowLeft className="w-5 h-5" />Previous</span>
              </Button>
              {/* Quiz Mode Button */}
              {practiceMode ? (
                <Button
                  variant="secondary"
                  onClick={togglePracticeMode}
                  aria-label="Exit Practice Mode"
                  className="rounded-full flex items-center justify-center min-w-[44px] md:w-44"
                >
                  <span className="md:hidden"><FiXCircle className="w-5 h-5" /></span>
                  <span className="hidden md:inline-flex items-center gap-x-2"><FiXCircle className="w-5 h-5" />Exit Quiz</span>
                </Button>
              ) : (
                <Button
                  onClick={togglePracticeMode}
                  aria-label="Enter Practice Mode"
                  className="rounded-full flex items-center justify-center min-w-[44px] md:w-44"
                >
                  <span className="md:hidden"><MdSportsEsports className="w-5 h-5" /></span>
                  <span className="hidden md:inline-flex items-center gap-x-2"><MdSportsEsports className="w-5 h-5" />Quiz Mode</span>
                </Button>
              )}
              {/* Next Lesson Button */}
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
