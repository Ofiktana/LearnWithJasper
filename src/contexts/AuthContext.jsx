import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Mock User Data with initial history for demonstration
const initialMockUsers = [
  {
    username: "demo",
    password: "password",
    name: "Demo User",
    scoreHistory: [],
  },
  {
    username: "mathwiz",
    password: "pass",
    name: "Math Wiz",
    scoreHistory: [
      {
        score: 10,
        attempted: 12,
        date: new Date(Date.now() - 86400000).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
    ],
  },
  {
    username: "quickmaths",
    password: "fast",
    name: "Quick Maths",
    scoreHistory: [
      {
        score: 25,
        attempted: 28,
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
    ],
  },
];

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => ({
    isLoggedIn: false,
    user: null, // { username, name, scoreHistory }
    mockUsers: initialMockUsers, // The mock database of all users
  }));

  const handleLogin = useCallback((username, password, onSuccess, onError) => {
    setAuth((prevAuth) => {
      const foundUser = prevAuth.mockUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        onSuccess?.(foundUser);
        return {
          ...prevAuth,
          isLoggedIn: true,
          user: foundUser,
        };
      } else {
        onError?.("Login failed: Invalid credentials.");
        return prevAuth;
      }
    });
  }, []);

  const handleRegister = useCallback((username, password, name, birthday, onSuccess, onError) => {
    setAuth((prevAuth) => {
      if (prevAuth.mockUsers.some((u) => u.username === username)) {
        onError?.("Registration failed: Username already exists.");
        return prevAuth;
      }

      const newUser = { username, password, name, birthday, scoreHistory: [] };
      onSuccess?.(newUser);
      return {
        ...prevAuth,
        mockUsers: [...prevAuth.mockUsers, newUser],
        isLoggedIn: true,
        user: newUser,
      };
    });
  }, []);

  const handleLogout = useCallback(() => {
    setAuth((prevAuth) => ({
      ...prevAuth,
      isLoggedIn: false,
      user: null,
    }));
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setAuth((prevAuth) => {
      const updatedMockUsers = prevAuth.mockUsers.map((u) =>
        u.username === updatedUser.username ? updatedUser : u
      );
      return {
        ...prevAuth,
        mockUsers: updatedMockUsers,
        user: updatedUser,
      };
    });
  }, []);

  const value = {
    isLoggedIn: auth.isLoggedIn,
    user: auth.user,
    mockUsers: auth.mockUsers,
    handleLogin,
    handleRegister,
    handleLogout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

