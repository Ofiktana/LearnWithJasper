import { createBrowserRouter } from "react-router-dom";
import AppContainer from "./components/AppContainer";
import WelcomeScreen from "./routes/WelcomeScreen";
import LoginForm from "./routes/LoginForm";
import RegisterForm from "./routes/RegisterForm";
import QuizPanel from './components/QuizPanel';    

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppContainer>
        <WelcomeScreen />
      </AppContainer>
    ),
  },
  {
    path: "/quiz",
    element: (
      <AppContainer>
        <QuizPanel />
      </AppContainer>
    ),
  },
  {
    path: "/login",
    element: (
      <AppContainer>
        <LoginForm />
      </AppContainer>
    ),
  },
  {
    path: "/register",
    element: (
      <AppContainer>
        <RegisterForm />
      </AppContainer>
    ),
  },
]);
