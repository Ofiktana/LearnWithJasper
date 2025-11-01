import { useNavigate } from "react-router-dom";

function QuizResultsPanel({ result, startNewQuiz }) {
// Hook call moved inside and is now UNCONDITIONAL
    const navigate = useNavigate();

    if (!result) return <div className="text-white text-center p-8">Loading results...</div>;

    const { score, attempted, timedOut } = result;
    const accuracy = attempted > 0 ? Math.round((score / attempted) * 100) : 0;
    const statusText = timedOut ? "Time Expired!" : "Quiz Completed!";
    const statusColor = timedOut ? "text-red-300" : "text-green-300";
    const statusIcon = timedOut ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
    );

    return (
        <div className="space-y-6 text-white text-center">
            {statusIcon}
            <h1 className={`text-3xl font-extrabold ${statusColor} mb-1`}>{statusText}</h1>
            <p className="text-lg text-gray-400">Your performance was recorded: {score}/{attempted}</p>
            <div className="bg-gray-700 p-6 rounded-xl shadow-inner border-t-4 border-indigo-500">
                <div className="flex justify-between items-center">
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-300">Total Correct</p>
                        <p className="text-5xl font-extrabold text-yellow-300">{score}</p>
                    </div>
                    <div className="text-center text-4xl font-light text-gray-400">/</div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-300">Questions Attempted</p>
                        <p className="text-5xl font-extrabold text-yellow-300">{attempted}</p>
                    </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-600">
                    <p className="text-xl font-bold text-indigo-400">Accuracy: {accuracy}%</p>
                </div>
            </div>
            <h3 className="text-xl font-bold text-indigo-300 pt-4">What's next?</h3>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => startNewQuiz()}
                    className="col-span-2 flex items-center justify-center space-x-3 p-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10.332v7.336a1 1 0 001.555.832l3.197-2.132c.563-.375.563-1.168 0-1.543z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Start New Session</span>
                </button>
                <button
                    onClick={() => navigate('/history')}
                    className="flex flex-col items-center justify-center p-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg shadow-md transition duration-150 ease-in-out"
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    History
                </button>
                <button
                    onClick={() => navigate('/leaderboard')}
                    className="flex flex-col items-center justify-center p-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg shadow-md transition duration-150 ease-in-out"
                >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15.5V11m0-1v4.5m5.454-3.558L17.5 12h-2M12 18V6m6 12a9 9 0 100-18 9 9 0 000 18z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11h.01"></path></svg>
                    Leaderboard
                </button>
                <button
                    onClick={() => navigate('/settings')}
                    className="col-span-2 flex items-center justify-center space-x-3 p-3 bg-gray-600 hover:bg-gray-500 text-gray-100 font-medium rounded-lg shadow-md mt-2 transition duration-150 ease-in-out"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.748 2.924-1.748 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.941 3.31 1.005 2.49 2.573a1.724 1.724 0 001.065 2.572c1.748.426 1.748 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.9 3.31-2.49 2.573a1.724 1.724 0 00-2.572 1.065c-.426 1.748-2.924 1.748-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-1.005-2.49-2.573a1.724 1.724 0 00-1.065-2.572c-1.748-.426-1.748-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.9-3.31 2.49-2.573a1.724 1.724 0 002.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>Change Settings</span>
                </button>
            </div>
        </div>
    );
}

export default QuizResultsPanel