const HistoryPanel = ({ user }) => {
    const history = user?.scoreHistory || [];
    const totalScore = history.reduce((sum, s) => sum + s.score, 0);
    const totalAttempted = history.reduce((sum, s) => sum + s.attempted, 0);
    const winRate = totalAttempted > 0 ? (totalScore / totalAttempted) : 0;


    return (
        <div className="space-y-4 text-white">
            <h2 className="text-2xl font-bold text-indigo-300 text-center border-b border-gray-700 pb-2">
                {user?.name}'s Quiz History
            </h2>

            <div className="bg-gray-700 rounded-xl p-4 shadow-lg text-center">
                <p className="text-xl font-bold text-indigo-400">Overall Performance</p>
                <p className="text-3xl font-extrabold mt-1">
                    {totalScore} / {totalAttempted}
                </p>
                <p className="text-sm text-gray-300">Accuracy: {Math.round(winRate * 100)}%</p>
                <p className="text-xs text-gray-400 mt-2">Total Sessions: {history.length}</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-300 border-b border-gray-700 pb-1 pt-2">Past Sessions</h3>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                {history.length > 0 ? (
                    history.map((session, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center p-3 rounded-lg shadow-inner ${session.timedOut ? 'bg-red-900/40' : session.completed ? 'bg-green-900/40' : 'bg-gray-600/50'}`}
                        >
                            <div className="text-sm font-light text-gray-400 w-1/4">{session.date}</div>
                            <div className='flex flex-col w-2/4 text-center'>
                                <span className={`text-xs italic ${session.timedOut ? 'text-red-300' : 'text-green-300'}`}>
                                    {session.completed ? 'Completed (10 Qs)' : session.timedOut ? 'Timed Out' : 'Stopped Early'}
                                </span>
                                <div className="text-lg font-bold">
                                    {session.score} / {session.attempted}
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-green-300 w-1/4 text-right">
                                {session.attempted > 0 ? `${Math.round((session.score / session.attempted) * 100)}%` : '0%'}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 italic py-4">No sessions recorded. Start a quiz!</p>
                )}
            </div>
        </div>
    );
};
export default HistoryPanel;