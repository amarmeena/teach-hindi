"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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

  // Reset shown answers when lesson changes
  const handleLessonChange = (idx: number) => {
    setCurrentStep(idx);
    setShownAnswers({});
  };

  // Helper to go to next/previous lesson
  const goToNext = () => handleLessonChange(Math.min(currentStep + 1, lessons.length - 1));
  const goToPrev = () => handleLessonChange(Math.max(currentStep - 1, 0));

  // Helper to jump to a lesson
  const jumpToLesson = (idx: number) => handleLessonChange(idx);

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
    <div className="min-h-screen flex bg-white dark:bg-black font-sans">
      {/* Progress Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-black text-gray-900 dark:text-white p-6 border-r border-gray-200 dark:border-gray-800 min-h-screen sticky top-0">
        <h2 className="text-xl font-bold mb-6 tracking-tight">Course Progress</h2>
        <ol className="space-y-3">
          {lessons.map((lesson, idx) => (
            <li
              key={lesson}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-base font-medium cursor-pointer select-none ${
                idx === currentStep
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => jumpToLesson(idx)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') jumpToLesson(idx); }}
              aria-current={idx === currentStep ? 'step' : undefined}
              aria-label={`Go to lesson: ${lesson}`}
            >
              <span className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${idx === currentStep ? "border-white bg-blue-700" : "border-blue-400 bg-white dark:bg-black"} text-xs font-bold`}>{idx + 1}</span>
              <span>{lesson}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep + 1} of {lessons.length}
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 rounded-full p-2 flex items-center justify-center shadow-lg border border-blue-400 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 transition-transform bg-blue-600 text-white dark:bg-white dark:text-blue-600"
        style={{ minWidth: 40, minHeight: 40, width: 40, height: 40 }}
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Open course progress sidebar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        <span className="sr-only">Open course progress sidebar</span>
      </button>
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <aside className="fixed inset-0 z-30 bg-black/70 flex">
          <div className="w-64 bg-white dark:bg-black text-gray-900 dark:text-white p-6 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-6 tracking-tight">Course Progress</h2>
            <ol className="space-y-3">
              {lessons.map((lesson, idx) => (
                <li
                  key={lesson}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-base font-medium cursor-pointer select-none ${
                    idx === currentStep
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => { jumpToLesson(idx); setSidebarOpen(false); }}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { jumpToLesson(idx); setSidebarOpen(false); } }}
                  aria-current={idx === currentStep ? 'step' : undefined}
                  aria-label={`Go to lesson: ${lesson}`}
                >
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${idx === currentStep ? "border-white bg-blue-700" : "border-blue-400 bg-white dark:bg-black"} text-xs font-bold`}>{idx + 1}</span>
                  <span>{lesson}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {lessons.length}
            </div>
            <Button className="mt-8" variant="secondary" onClick={() => setSidebarOpen(false)}>
              Close
            </Button>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center tracking-tight text-gray-900 dark:text-white">Learn Hindi</h1>
          {/* Lesson Card */}
          <div className="bg-white dark:bg-black rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-gray-900 dark:text-white">{lessons[currentStep]}</h2>
            {/* Vocabulary Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Vocabulary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseContent[currentStep].vocabulary.map(([hindi, english]: [string, string], i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="font-medium text-gray-900 dark:text-white">{hindi}</span>
                    <span className="text-gray-600 dark:text-gray-300">{english}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Practice Section */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Practice</h3>
              <div className="space-y-4">
                {courseContent[currentStep].practice.map((item: PracticeItem, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="mb-2 text-gray-800 dark:text-gray-200">{item.prompt}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{item.question}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full shadow-sm"
                        onClick={() => toggleAnswer(i)}
                        aria-expanded={!!shownAnswers[i]}
                        aria-controls={`answer-${i}`}
                      >
                        {shownAnswers[i] ? "Hide Answer" : "Show Answer"}
                      </Button>
                      {shownAnswers[i] && (
                        <span
                          id={`answer-${i}`}
                          className="ml-2 text-blue-700 dark:text-blue-400 font-semibold"
                        >
                          {item.answer}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="secondary" onClick={goToPrev} disabled={currentStep === 0} className="rounded-full shadow-sm">
              Previous Lesson
            </Button>
            <Button onClick={goToNext} disabled={currentStep === lessons.length - 1} className="rounded-full shadow-sm">
              Next Lesson
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
