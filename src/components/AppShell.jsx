import { useState, useEffect, useCallback, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import WelcomeScreen from "../routes/WelcomeScreen";
import LoginForm from "../routes/LoginForm";
import RegisterForm from "../routes/RegisterForm";
import HeaderButton from "./HeaderButton";
import QuizPanel from "./QuizPanel";
import SettingsPanel from "../routes/SettingsPanel";
import LeaderboardPanel from "../routes/LeaderboardPanel";
import HistoryPanel from "../routes/HistoryPanel";

function AppShell() {
  const navigate = useNavigate();
  const { isLoggedIn, user, mockUsers, updateUser, handleLogout: authLogout } = useAuth();

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

  // --- Quiz State ---
  const [quizState, setQuizState] = useState(initialQuizState);

  // Combined state for easier reference in handlers (only quiz state now)
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
  }, [generateProblem, initialQuizState]);

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

  // --- Authentication Handlers ---

  const handleLogout = () => {
    // Save current session before logging out, if there's data
    if (state.score > 0 || state.attempted > 0) {
      handleSaveAndShowResults();
    }

    setQuizState(initialQuizState); // Reset quiz state upon logout
    authLogout(); // Call auth context logout
    navigate("/", { replace: true }); // Navigate to welcome screen
    showMessage("You have been logged out.", "text-gray-300");
  };

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

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <div
        id="app-container"
        className="w-full max-w-lg bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300"
      >
        {/* Header */}
        <div className="p-4 bg-gray-900 flex justify-between items-center border-b border-gray-700">
          <div className="flex flex-col">
            <h1
              className="text-2xl font-extrabold text-indigo-400 cursor-pointer"
              onClick={() => navigate(isLoggedIn ? "/quiz" : "/")}
            >
              Learn with Jasper
            </h1>
            {isLoggedIn && user && (
              <span className="text-xs text-green-400 mt-1 truncate max-w-[150px] sm:max-w-none">
                User: {user.name}
              </span>
            )}
          </div>

          <HeaderButton handleLogout={handleLogout} />
        </div>

        {/* Content Area - Router takes over */}
        <div id="content-area" className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/quiz" replace />
                ) : (
                  <WelcomeScreen navigate={navigate} />
                )
              }
            />
            <Route
              path="/login"
              element={<LoginForm />}
            />
            <Route
              path="/register"
              element={<RegisterForm />}
            />
            {/* Protected Routes */}
            <Route
              path="/quiz"
              element={
                isLoggedIn ? (
                  <QuizPanel
                    state={state}
                    generateProblem={generateProblem}
                    handleDigit={handleDigit}
                    handleClear={handleClear}
                    handleSubmit={handleSubmit}
                    handleSaveAndShowResults={handleSaveAndShowResults}
                    startNewQuiz={startNewQuiz}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isLoggedIn ? (
                  <SettingsPanel
                    state={state}
                    setQuizState={setQuizState}
                    showMessage={showMessage}
                    generateProblem={generateProblem}
                    navigate={navigate}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/leaderboard"
              element={
                isLoggedIn ? (
                  <LeaderboardPanel
                    leaderboard={leaderboard}
                    user={user}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/history"
              element={
                isLoggedIn ? (
                  <HistoryPanel user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="*"
              element={
                <div className="text-white text-center p-8">
                  404 - Not Found
                </div>
              }
            />
          </Routes>
        </div>

        {/* GLOBAL SPONSORSHIP FOOTER - NEW CONTENT */}
        <div className="p-3 bg-gray-900 text-center border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Proudly sponsored by{" "}
            <a
              href="https://instagram.com/reen_kids_store"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline font-semibold"
            >
              @reen_kids_store
            </a>{" "}
            💚
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppShell;
