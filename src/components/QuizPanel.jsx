import { useEffect } from 'react';
import QuizResultsPanel from './QuizResultsPanel';
import { formatTime } from '../utils/helperFunctions';
import { useQuiz } from '../contexts/QuizContext';
import { RxEnter } from "react-icons/rx";
import { BsCCircle } from "react-icons/bs";

const QuizPanel = () => {
    const { state, generateProblem, handleDigit, handleClear, handleSubmit, handleSaveAndShowResults, startNewQuiz } = useQuiz();

    // Quiz Panel Displays

    const quizKeys = [
        { key: '7', value: 7 },
        { key: '8', value: 8 },
        { key: '9', value: 9 },
        { key: 'CLEAR', value: <BsCCircle /> },
        { key: '4', value: 4 },
        { key: '5', value: 5 },
        { key: '6', value: 6 },
        { key: 'SUBMIT', value: <RxEnter /> },
        { key: '1', value: 1 },
        { key: '2', value: 2 },
        { key: '3', value: 3 },
        { key: '0', value: 0 },
    ]

    // HOOK 1 (Keyboard Handler) - MOVED TO TOP (UNCONDITIONAL)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only handle input if not waiting and not showing results
            if (state.showResults || state.isWaitingForNext || state.timeRemaining === 0) return;

            if (e.key >= '0' && e.key <= '9') {
                handleDigit(parseInt(e.key));
            } else if (e.key === 'Enter') {
                handleSubmit();
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                handleClear();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [state.isWaitingForNext, state.userInput, state.timeRemaining, handleDigit, handleClear, handleSubmit, state.showResults]);

    // HOOK 2 (Problem Generator) - MOVED TO TOP (UNCONDITIONAL)
    useEffect(() => {
        if (!state.showResults && (state.multiplier1 === null || state.tables.length === 0)) {
            generateProblem();
        }
    }, [generateProblem, state.multiplier1, state.tables.length, state.showResults]);

    // If results are available, show the dedicated results panel (Conditional Return)
    if (state.showResults) {
        return (
            <QuizResultsPanel
                result={state.lastSessionResult}
                startNewQuiz={startNewQuiz}
                // navigate prop removed
            />
        );
    }

    // --- Start of Quiz Game View ---

    const questionText = state.multiplier1 !== null && state.multiplier2 !== null
        ? `${state.multiplier1} × ${state.multiplier2} = ?`
        : "Loading...";

    // Disable keypad if the session has ended
    const isSessionOver = state.timeRemaining === 0 || state.attempted >= state.sessionMaxQuestions;

    return (
        <div className="space-y-4 text-white">
            {/* Scoreboard and Timer */}
            <div className="flex justify-between items-center text-sm font-semibold text-gray-400 pb-2">
                <span className='w-1/2'>
                    Question:
                    <span id="question-count" className='text-white ml-1'>{state.attempted}</span> / {state.sessionMaxQuestions}
                </span>
                <span
                    className={`text-2xl font-extrabold transition-colors duration-300 ${
                        state.timeRemaining <= 30 && state.timeRemaining > 0 ? 'text-red-400 animate-pulse' :
                        state.timeRemaining === 0 ? 'text-red-500' : 'text-indigo-400'
                    }`}
                >
                    {formatTime(state.timeRemaining)}
                </span>
            </div>
            <div className='text-sm font-semibold text-gray-400 text-left -mt-2'>
                Current Score: <span className='text-white'>{state.score}</span>
            </div>

            {/* Quiz Display and Input */}
            <div className="rounded-xl overflow-hidden bg-white shadow-lg">
                <div className="text-4xl sm:text-5xl font-extrabold p-4 text-gray-900 text-center bg-gray-100 flex items-center justify-center min-h-[6rem]">
                    {questionText}
                </div>
                <div className="text-right text-5xl sm:text-6xl font-extrabold text-gray-800 p-4 bg-gray-200 border-t-4 border-indigo-500">
                    {state.userInput || 0}
                </div>
            </div>

            {/* Feedback Message */}
            <div className={`text-center font-bold text-lg min-h-[1.5rem] transition-colors duration-300 ${state.messageColor}`}>
                {state.message}
            </div>

            {/* End Session Early Button */}
            {(state.score > 0 || state.attempted > 0) && !isSessionOver && (
                <button
                    onClick={() => handleSaveAndShowResults(false)}
                    className="w-full py-2 text-sm bg-yellow-600 hover:bg-yellow-500 rounded-xl font-bold transition duration-150 shadow-md text-white"
                >
                    End Session Early ({state.score}/{state.attempted})
                </button>
            )}

            {/* Calculator Keypad */}
            <div id="keypad" className="grid grid-cols-4 gap-3 pt-4">

                {quizKeys.map((item, index) => {
                    const isClear = item.key === 'CLEAR';
                    const isSubmit = item.key === 'SUBMIT';
                    const isZero = item.key === 0;

                    let classes = "keypad-button rounded-xl p-4 text-2xl transition duration-150";
                    let action = null;

                    if (isClear) {
                        classes += " bg-red-600 hover:bg-red-500 text-white text-xl";
                        action = handleClear;
                    } else if (isSubmit) {
                        classes += " bg-indigo-600 hover:bg-indigo-500 text-white row-span-2 flex items-center justify-center";
                        action = handleSubmit;
                    } else if (typeof key === 'number') {
                         classes += " bg-gray-600 hover:bg-gray-500 text-white";
                         action = () => handleDigit(item.value);
                    }
                    if (isZero) {
                        classes += " col-span-3";
                    }

                    const isDisabled = state.isWaitingForNext || isSessionOver;

                        if (index > 7 && item.key === 'SUBMIT') return null;

                    return (
                        <button key={item.key} className={classes} onClick={action} disabled={isDisabled}>
                            {item.value}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizPanel;