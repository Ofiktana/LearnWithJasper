import { useLocation } from 'react-router-dom';

const HeaderButton = ({ isLoggedIn, handleLogout, navigate }) => {
    const location = useLocation();
    const currentPath = location.pathname.split('/')[1];

    if (!isLoggedIn) return null;

    const navItems = [
        { path: 'quiz', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        ), navigateTo: '/quiz', label: 'Quiz' },
        { path: 'history', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        ), navigateTo: '/history', label: 'History' },
        { path: 'leaderboard', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 13.5V6.75a3.75 3.75 0 0 0-7.5 0v6.75m1.5-6.75h.008v.008H10.5V6.75ZM6 20.25h12V21a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75v-.75Z" /><path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>
        ), navigateTo: '/leaderboard', label: 'Leaderboard' },
        { path: 'settings', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 18H7.5m9-12h2.25m-2.25 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 12h2.25m-2.25 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0" /></svg>
        ), navigateTo: '/settings', label: 'Settings' },
    ];

    return (
        <div className="flex items-center space-x-3">
            {navItems.map(item => (
                <button
                    key={item.path}
                    onClick={() => navigate(item.navigateTo)}
                    className={`p-2 rounded-full transition duration-150 focus:outline-none ${
                        currentPath === item.path ? 'text-indigo-400 bg-gray-700' : 'text-gray-300 hover:text-indigo-400'
                    }`}
                    aria-label={item.label}
                >
                    {item.icon}
                </button>
            ))}
            <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 p-2 text-sm font-semibold rounded-lg transition duration-150 focus:outline-none"
                aria-label="Logout"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H4.5" /></svg>
            </button>
        </div>
    );
};

export default HeaderButton;