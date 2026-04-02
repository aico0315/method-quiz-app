import { useState, useCallback, useEffect } from "react";
import type { Level, Question, Screen } from "./types";
import { questions } from "./data/questions";
import MenuScreen from "./components/MenuScreen";
import QuizScreen from "./components/QuizScreen";
import ClearScreen from "./components/ClearScreen";
import styles from "./App.module.css";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [level, setLevel] = useState<Level>("junior");
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleStart = useCallback((selectedLevel: Level) => {
    const filtered = shuffle(questions.filter((q) => q.level === selectedLevel));
    setLevel(selectedLevel);
    setQuizQuestions(filtered);
    setCurrentIndex(0);
    setCorrectCount(0);
    setScreen("quiz");
  }, []);

  const handleNext = useCallback(
    (isCorrect: boolean) => {
      const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
      const nextIndex = currentIndex + 1;

      if (nextIndex >= quizQuestions.length) {
        setCorrectCount(nextCorrect);
        setScreen("clear");
      } else {
        setCorrectCount(nextCorrect);
        setCurrentIndex(nextIndex);
      }
    },
    [correctCount, currentIndex, quizQuestions.length]
  );

  const handleRetry = useCallback(() => handleStart(level), [handleStart, level]);
  const handleMenu = useCallback(() => setScreen("menu"), []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>Method Quiz</span>
        <button
          className={styles.themeToggle}
          onClick={() => setIsDark((d) => !d)}
          aria-label={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </header>
      <main className={styles.main}>
        {screen === "menu" && <MenuScreen onStart={handleStart} />}
        {screen === "quiz" && quizQuestions.length > 0 && (
          <QuizScreen
            question={quizQuestions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={quizQuestions.length}
            onNext={handleNext}
            onMenu={handleMenu}
          />
        )}
        {screen === "clear" && (
          <ClearScreen
            correctCount={correctCount}
            totalCount={quizQuestions.length}
            level={level}
            onRetry={handleRetry}
            onMenu={handleMenu}
          />
        )}
      </main>
    </div>
  );
}
