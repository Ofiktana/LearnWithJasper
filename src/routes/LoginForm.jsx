import { useState } from 'react';

const LoginForm = ({ state, handleLogin, navigate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onLoginSubmit = (e) => {
        e.preventDefault();
        handleLogin(username, password);
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
            <div className={`text-center font-bold text-md min-h-[1.5rem] ${state.messageColor}`}>{state.message}</div>
        </div>
    );
};

export default LoginForm;