import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const { handleLogin: authHandleLogin, isLoggedIn } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('text-gray-300');

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/quiz', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const onLoginSubmit = (e) => {
        e.preventDefault();
        const success = authHandleLogin(
            username,
            password,
            (user) => {
                // onSuccess callback
                setMessage(`Welcome back, ${user.name}!`);
                setMessageColor('text-indigo-400');
                navigate('/quiz', { replace: true });
            },
            (errorMessage) => {
                // onError callback
                setMessage(errorMessage);
                setMessageColor('text-red-500');
            }
        );
    };

    return (
        <div className="space-y-6 text-white max-w-sm mx-auto p-4">
            <h2 className="text-2xl font-bold text-indigo-300 text-center">User Login</h2>
            <form onSubmit={onLoginSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username (e.g., demo)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                />
                <input
                    type="password"
                    placeholder="Password (e.g., password)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                />
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition duration-150 shadow-md">
                    Login
                </button>
            </form>
            <div className="text-center text-sm text-gray-400">
                Don't have an account?
                <button onClick={() => navigate('/register')} className="text-indigo-400 hover:underline ml-1">
                    Register here
                </button>
            </div>
            <div className={`text-center font-bold text-md min-h-[1.5rem] ${messageColor}`}>{message}</div>
        </div>
    );
};

export default LoginForm;