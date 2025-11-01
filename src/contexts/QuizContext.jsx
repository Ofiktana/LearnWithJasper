import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const QuizContext = createContext(null);

// Constants for all possible tables
const ALL_TABLES = Array.from({ length: 11 }, (_, i) => i + 2);

// Initial state for a fresh quiz session
const initialQuizState = {
  tables: ALL_TABLES,
  score: 0,
  attempted: 0,
  sessionMaxQuestions: 10, // Maximum questions per session
  timeRemaining: 300, // 5 minutes in seconds
  isTimerRunning: false, // Timer control
  multiplier1: null,
  multiplier2: null,
  correctAnswer: null,
  userInput: "",
  isWaitingForNext: false,
  message: "Let's begin!",
  messageColor: "text-gray-300",

  // Fields for post-quiz flow
  showResults: false,
  lastSessionResult: null, // { score: number, attempted: number, timedOut: boolean }
};

export function QuizProvider({ children }) {
  const navigate = useNavigate();
  const { isLoggedIn, user, mockUsers, updateUser } = useAuth();

  // --- Quiz State ---
  const [quizState, setQuizState] = useState(initialQuizState);

  // Combined state for easier reference in handlers
  const state = quizState;

  // --- Utility Functions ---

  const showMessage = useCallback((text, colorClass) => {
    setQuizState((prevState) => ({
      ...prevState,
      message: text,
      messageColor: colorClass,
    }));
  }, []);

  const generateProblem = useCallback(() => {
    setQuizState((prevState) => {
      if (prevState.tables.length === 0) {
        showMessage(
          "Please select at least one table to start!",
          "text-yellow-400"
        );
        navigate("/settings");
        return prevState;
      }

      const index1 = Math.floor(Math.random() * prevState.tables.length);
      const m1 = prevState.tables[index1];
      const m2 = Math.floor(Math.random() * 12) + 1;

      return {
        ...prevState,
        multiplier1: m1,
        multiplier2: m2,
        correctAnswer: m1 * m2,
        userInput: "",
        isWaitingForNext: false,
        isTimerRunning: true, // Start timer when a problem is generated
        showResults: false, // Ensure results screen is hidden
        message: "Enter your answer below.",
        messageColor: "text-gray-300",
      };
    });
  }, [showMessage, navigate]);

  // Function to fully reset state and start a new quiz
  const startNewQuiz = useCallback(() => {
    setQuizState((prevState) => ({
      ...initialQuizState,
      tables: prevState.tables,
    }));
    generateProblem();
  }, [generateProblem]);

  // Function to fully reset quiz state (useful for logout)
  const resetQuiz = useCallback(() => {
    setQuizState(initialQuizState);
  }, []);

  // --- Leaderboard Calculation (Memoized) ---
  const leaderboard = useMemo(() => {
    return mockUsers
      .map((user) => {
        const totalScore = user.scoreHistory.reduce(
          (sum, session) => sum + session.score,
          0
        );
        const totalAttempted = user.scoreHistory.reduce(
          (sum, session) => sum + session.attempted,
          0
        );
        const winRate = totalAttempted > 0 ? totalScore / totalAttempted : 0;

        return {
          name: user.name,
          totalScore,
          totalAttempted,
          winRate: Math.round(winRate * 100),
        };
      })
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        return b.winRate - a.winRate;
      })
      .slice(0, 10);
  }, [mockUsers]);

  // --- Quiz Session Control Handlers ---

  const handleSaveAndShowResults = useCallback(
    (isTimeout = false) => {
      const { score, attempted, sessionMaxQuestions } = state;

      if (!user) return; // Must be logged in
      if (attempted === 0 && !isTimeout) {
        showMessage("No attempts recorded to save.", "text-yellow-400");
        return;
      }

      // 1. Prepare session data
      const newSession = {
        score,
        attempted,
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        completed: attempted >= sessionMaxQuestions,
        timedOut: isTimeout,
      };

      // 2. Update the current user's history and mockUsers database
      const updatedUser = {
        ...user,
        scoreHistory: [newSession, ...user.scoreHistory],
      };

      updateUser(updatedUser);

      // 3. Reset quiz state, but set flags to show results panel
      setQuizState((prevState) => ({
        ...initialQuizState, // Reset score, attempted, time, etc.
        tables: prevState.tables, // Keep selected tables
        isTimerRunning: false, // Timer is definitely off
        multiplier1: null, // Clear problem

        // Show results screen
        showResults: true,
        lastSessionResult: { score, attempted, timedOut: isTimeout },

        message: isTimeout
          ? "Time's up! Check your results."
          : "Quiz finished! Review your performance.",
        messageColor: isTimeout ? "text-red-500" : "text-green-400",
      }));
    },
    [
      user,
      state.score,
      state.attempted,
      state.sessionMaxQuestions,
      showMessage,
      updateUser,
    ]
  );

  // --- Timer and Session End Logic ---

  useEffect(() => {
    // Timer countdown
    let timerInterval;
    if (
      state.isTimerRunning &&
      state.timeRemaining > 0 &&
      state.attempted < state.sessionMaxQuestions
    ) {
      timerInterval = setInterval(() => {
        setQuizState((prevState) => {
          // Stop timer at 0
          if (prevState.timeRemaining <= 1) {
            return { ...prevState, timeRemaining: 0, isTimerRunning: false };
          }
          return { ...prevState, timeRemaining: prevState.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [
    state.isTimerRunning,
    state.timeRemaining,
    state.attempted,
    state.sessionMaxQuestions,
  ]);

  useEffect(() => {
    // Automatic session end handlers
    if (!isLoggedIn || state.isWaitingForNext || state.showResults)
      return;

    // Handle Time Expired
    if (state.timeRemaining === 0 && state.isTimerRunning) {
      setQuizState((prevState) => ({ ...prevState, isTimerRunning: false }));
      handleSaveAndShowResults(true); // Call handler to save score and show results
    }
  }, [
    isLoggedIn,
    state.timeRemaining,
    state.isTimerRunning,
    state.isWaitingForNext,
    state.showResults,
    handleSaveAndShowResults,
  ]);

  // --- Quiz Logic Handlers ---

  const handleDigit = (digit) => {
    if (state.isWaitingForNext || state.timeRemaining === 0) return;

    setQuizState((prevState) => {
      const inputString = prevState.userInput + digit.toString();

      if (inputString.length > 5) {
        showMessage("Answer too long!", "text-yellow-400");
        return prevState;
      }

      return { ...prevState, userInput: inputString };
    });
  };

  const handleClear = () => {
    if (state.isWaitingForNext || state.timeRemaining === 0) return;
    setQuizState((prevState) => ({ ...prevState, userInput: "" }));
    showMessage("Input cleared.", "text-gray-300");
  };

  const handleSubmit = () => {
    if (
      state.isWaitingForNext ||
      state.userInput === "" ||
      state.timeRemaining === 0
    )
      return;

    const userAnswer = parseInt(state.userInput);

    setQuizState((prevState) => {
      if (prevState.attempted >= prevState.sessionMaxQuestions) {
        return { ...prevState, isTimerRunning: false };
      }

      const newAttempted = prevState.attempted + 1;
      const isFinalQuestion = newAttempted === prevState.sessionMaxQuestions;
      let newState = { ...prevState, attempted: newAttempted };

      if (userAnswer === prevState.correctAnswer) {
        newState.score = prevState.score + 1;
        showMessage(
          isFinalQuestion ? "CORRECT! Final Answer." : "CORRECT! 🎉",
          "text-green-400"
        );
      } else {
        showMessage(
          `INCORRECT. The answer was ${prevState.correctAnswer}.`,
          "text-red-500"
        );
      }

      // Check for end of session
      if (isFinalQuestion) {
        newState.isTimerRunning = false;
        newState.isWaitingForNext = true;
        // Trigger results screen after a short delay to show the final message
        setTimeout(() => handleSaveAndShowResults(false), 1000);
      } else {
        newState.isWaitingForNext = true;
        // Generate next problem after delay
        setTimeout(() => {
          generateProblem();
        }, 1000);
      }
      return newState;
    });
  };

  // Context value to provide to children
  const quizContextValue = useMemo(() => ({
    state,
    setQuizState,
    generateProblem,
    handleDigit,
    handleClear,
    handleSubmit,
    handleSaveAndShowResults,
    startNewQuiz,
    resetQuiz,
    showMessage,
    leaderboard,
    user,
  }), [
    state,
    setQuizState,
    generateProblem,
    handleDigit,
    handleClear,
    handleSubmit,
    handleSaveAndShowResults,
    startNewQuiz,
    resetQuiz,
    showMessage,
    leaderboard,
    user,
  ]);

  return (
    <QuizContext.Provider value={quizContextValue}>
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
