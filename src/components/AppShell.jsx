import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { QuizProvider, useQuiz } from "../contexts/QuizContext";
import HeaderButton from "./HeaderButton";

// Inner component that has access to QuizContext
function AppShellContent({ children }) {
  const navigate = useNavigate();
  const { isLoggedIn, user, handleLogout: authLogout } = useAuth();
  const { state, handleSaveAndShowResults, resetQuiz, showMessage } = useQuiz();

  // --- Authentication Handlers ---
  const handleLogout = () => {
    // Save current session before logging out, if there's data
    if (state.score > 0 || state.attempted > 0) {
      handleSaveAndShowResults();
    }

    resetQuiz(); // Reset quiz state upon logout
    authLogout(); // Call auth context logout
    navigate("/", { replace: true }); // Navigate to welcome screen
    showMessage("You have been logged out.", "text-gray-300");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <div
        id="app-container"
        className="w-full max-w-lg bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300"
      >
        {/* Header */}
        <div className="p-4 bg-gray-700 flex justify-between items-center border-b border-gray-700">
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

        {/* Content Area - Routes render here */}
        <div id="content-area" className="p-6">
          {children}
        </div>

        {/* GLOBAL SPONSORSHIP FOOTER - NEW CONTENT */}
        <div className="p-3 bg-gray-700 text-center border-t border-gray-700">
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

// Outer component that provides QuizContext
function AppShell({ children }) {
  return (
    <QuizProvider>
      <AppShellContent>{children}</AppShellContent>
    </QuizProvider>
  );
}

export default AppShell;
