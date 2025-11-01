import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';

const SettingsPanel = () => {
    const navigate = useNavigate();
    const { state, setQuizState, showMessage, generateProblem } = useQuiz();

    const ALL_TABLES = Array.from({ length: 11 }, (_, i) => i + 2); // [2, 3, ..., 12]

    const toggleTable = (tableNumber) => {
        setQuizState(prevState => {
            const index = prevState.tables.indexOf(tableNumber);
            const newTables = [...prevState.tables];

            if (index > -1) {
                if (newTables.length > 1) {
                    newTables.splice(index, 1);
                } else {
                    showMessage("You must keep at least one table selected!", 'text-red-400');
                    return prevState;
                }
            } else {
                newTables.push(tableNumber);
            }
            newTables.sort((a, b) => a - b);
            return { ...prevState, tables: newTables };
        });
    };

    return (
        <div className="text-white space-y-4">
            <h2 className="text-xl font-bold text-indigo-300 border-b border-gray-700 pb-2">Select Times Tables (2-12)</h2>
            <div className="grid grid-cols-4 gap-3">
                {ALL_TABLES.map(table => (
                    <button
                        key={table}
                        onClick={() => toggleTable(table)}
                        className={`p-3 rounded-lg font-bold text-white transition duration-150
                            ${state.tables.includes(table) ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-600 hover:bg-gray-500'}`
                        }
                    >
                        × {table}
                    </button>
                ))}
            </div>
            <div className="text-sm text-gray-400 pt-4">You must select at least one table to start the quiz.</div>
            <button
                onClick={() => { navigate('/quiz'); generateProblem(); }}
                className="w-full mt-4 py-3 bg-indigo-700 hover:bg-indigo-600 rounded-lg font-bold transition duration-150"
            >
                Start Quiz
            </button>
        </div>
    );
};

export default SettingsPanel;