import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AppContainer({ children }) {
  const navigate = useNavigate();

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
  
    // Combined state for easier reference in handlers
    const state = { ...quizState };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <div
        id="app-container"
        className="w-full max-w-lg bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300"
      >
        {/* Header */}
        <div className="p-4 bg-gray-800 flex justify-between items-center border-b border-gray-700">
          <div className="flex flex-col">
            <h1
              className="text-2xl font-extrabold text-indigo-400 cursor-pointer"
              onClick={() => navigate(state.isLoggedIn ? "/quiz" : "/")}
            >
              Learn with Jasper
            </h1>
            {/* {state.isLoggedIn && state.user && (
                            <span className="text-xs text-green-400 mt-1 truncate max-w-[150px] sm:max-w-none">
                                User: {state.user.name}
                            </span>
                        )} */}
          </div>

          {/* <HeaderButton isLoggedIn={state.isLoggedIn} handleLogout={handleLogout} navigate={navigate} /> */}
        </div>

        {/* Content Area - Router takes over */}
        {children}

        {/* GLOBAL SPONSORSHIP FOOTER - NEW CONTENT */}
        <div className="p-3 bg-gray-600 text-center border-t border-gray-700">
          <p className="text-xs text-gray-200">
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

export default AppContainer;
