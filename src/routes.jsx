import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell";
import WelcomeScreen from "./routes/WelcomeScreen";
import LoginForm from "./routes/LoginForm";
import RegisterForm from "./routes/RegisterForm";
import QuizPanel from './components/QuizPanel';
import SettingsPanel from './routes/SettingsPanel';
import LeaderboardPanel from './routes/LeaderboardPanel';
import HistoryPanel from './routes/HistoryPanel';
import { useAuth } from './contexts/AuthContext';

// Route wrapper components that are evaluated at render time, not at module load time
const WelcomeRoute = () => (
  <AppShell>
    <WelcomeScreen />
  </AppShell>
);

const QuizRoute = () => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppShell>
      <QuizPanel />
    </AppShell>
  );
};

const SettingsRoute = () => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppShell>
      <SettingsPanel />
    </AppShell>
  );
};

const LeaderboardRoute = () => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppShell>
      <LeaderboardPanel />
    </AppShell>
  );
};

const HistoryRoute = () => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppShell>
      <HistoryPanel />
    </AppShell>
  );
};

const LoginRoute = () => (
  <AppShell>
    <LoginForm />
  </AppShell>
);

const RegisterRoute = () => (
  <AppShell>
    <RegisterForm />
  </AppShell>
);

const NotFoundRoute = () => (
  <AppShell>
    <div className="text-white text-center p-8">
      <h1 className="text-3xl font-bold text-red-400 mb-4">404 - Not Found</h1>
      <p className="text-gray-400">The page you're looking for doesn't exist.</p>
    </div>
  </AppShell>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomeRoute />,
  },
  {
    path: "/quiz",
    element: <QuizRoute />,
  },
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    path: "/register",
    element: <RegisterRoute />,
  },
  {
    path: "/settings",
    element: <SettingsRoute />,
  },
  {
    path: "/leaderboard",
    element: <LeaderboardRoute />,
  },
  {
    path: "/history",
    element: <HistoryRoute />,
  },
  {
    path: "*",
    element: <NotFoundRoute />,
  },
]);
