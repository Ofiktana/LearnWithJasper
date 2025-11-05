import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterForm = () => {
    const navigate = useNavigate();
    const { handleRegister: authHandleRegister, isLoggedIn } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('text-gray-300');

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/quiz', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const onRegisterSubmit = (e) => {
        e.preventDefault();
        
        // Validate password match
        if (password !== confirmPassword) {
            setMessage('Passwords do not match. Please try again.');
            setMessageColor('text-red-500');
            return;
        }
        
        authHandleRegister(
            username,
            password,
            name,
            birthday,
            (user) => {
                // onSuccess callback
                setMessage(`Registration successful! Welcome, ${name}!`);
                setMessageColor('text-green-400');
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
            <h2 className="text-2xl font-bold text-indigo-300 text-center">New User Registration</h2>
            <form onSubmit={onRegisterSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                />
                <div>
                    <label htmlFor="birthday" className="block text-sm font-medium text-gray-300 mb-2">
                        Birthday
                    </label>
                    <input
                        id="birthday"
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        required
                    />
                </div>
                <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition duration-150 shadow-md">
                    Register & Login
                </button>
            </form>
            <div className="text-center text-sm text-gray-400">
                Already registered?
                <button onClick={() => navigate('/login')} className="text-indigo-400 hover:underline ml-1">
                    Go to Login
                </button>
            </div>
            <div className={`text-center font-bold text-md min-h-[1.5rem] ${messageColor}`}>{message}</div>
        </div>
    );
};

export default RegisterForm;