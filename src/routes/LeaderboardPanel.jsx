const LeaderboardPanel = ({ leaderboard, user }) => {
    return (
        <div className="space-y-4 text-white">
            <h2 className="text-2xl font-bold text-indigo-300 text-center border-b border-gray-700 pb-2">Top 10 Leaderboard</h2>

            <div className="bg-gray-700 rounded-xl p-3 shadow-lg">
                {/* Header */}
                <div className="flex font-bold text-sm text-gray-400 mb-2 border-b border-gray-600 pb-1">
                    <span className="w-1/12 text-center">#</span>
                    <span className="w-6/12">Player</span>
                    <span className="w-3/12 text-right">Score</span>
                    <span className="w-2/12 text-right">Rate</span>
                </div>

                {/* Entries */}
                <div className="space-y-2">
                    {leaderboard.length > 0 ? (
                        leaderboard.map((entry, index) => (
                            <div
                                key={entry.name}
                                className={`flex items-center text-sm p-2 rounded-lg ${
                                    index === 0 ? 'bg-yellow-800/50 text-yellow-300 font-extrabold' :
                                    entry.name === user?.name ? 'bg-indigo-600/50 font-semibold' : 'bg-gray-600/50'
                                }`}
                            >
                                <span className="w-1/12 text-center">{index + 1}</span>
                                <span className="w-6/12 truncate">{entry.name}</span>
                                <span className="w-3/12 text-right">{entry.totalScore}</span>
                                <span className="w-2/12 text-right">{entry.winRate}%</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 italic py-4">No scores recorded yet!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPanel;