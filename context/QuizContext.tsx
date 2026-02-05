import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { Topic, Question, Mascot, WrongAnswer } from '../types';
import { useLocalStorage, useUserStats, useQuizProgress } from '../hooks/useLocalStorage';

// Mascots data
export const MASCOTS: Mascot[] = [
    { id: 'unicorn', emoji: '🦄', name: 'Sparkle', color: '#e91e63', bgGradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)' },
    { id: 'panda', emoji: '🐼', name: 'Bamboo', color: '#4caf50', bgGradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' },
    { id: 'rocket', emoji: '🚀', name: 'Blaze', color: '#ff5722', bgGradient: 'linear-gradient(135deg, #fbe9e7 0%, #ffccbc 100%)' },
    { id: 'tiger', emoji: '🐯', name: 'Stripe', color: '#ff9800', bgGradient: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' },
    { id: 'koala', emoji: '🐨', name: 'Cuddles', color: '#607d8b', bgGradient: 'linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)' },
];

// Quiz state interface
interface QuizState {
    currentScreen: 'login' | 'landing' | 'question' | 'results' | 'settings' | 'spellCheck' | 'worksheetGenerator';
    playerName: string;
    selectedMascot: string;
    interfaceStyle: 'kid' | 'minimal';
    randomize: boolean;
    selectedTopic: Topic | null;
    currentQuestionIndex: number;
    questions: Question[];
    selectedAnswer: string | null;
    typedAnswer: string; // For TTA/FIB question types
    userAnswers: { questionIndex: number; selectedAnswer: string | null; typedAnswer: string; isCorrect: boolean }[];
    correctAnswers: number;
    skippedCount: number; // Track skipped questions
    wrongAnswers: WrongAnswer[]; // Track wrong answers for review
    quizScore: number;
    timeLeft: number;
    isLoadingQuestions: boolean;
    questionAnswered: boolean;
    usedKnowMoreBeforeAnswer: boolean;
    showKnowMorePopup: boolean;
    // Map of topicId -> worksheetId (e.g., { 'math': 'ws1', 'geography': 'ws2' })
    worksheetSettings: Record<string, string>;
    // Map of tileIndex (1-10) -> worksheetId (e.g. { 1: 'ws1', 2: 'ws7' })
    tileSettings: Record<number, string>;
    currentWorksheetName?: string;
    globalDifficulty: 'None' | 'Easy' | 'Medium' | 'Hard';
    tileNames: Record<number, string>;
}

// Action types
type QuizAction =
    | { type: 'SET_SCREEN'; screen: QuizState['currentScreen'] }
    | { type: 'SET_PLAYER_NAME'; name: string }
    | { type: 'SET_MASCOT'; mascotId: string }
    | { type: 'SET_INTERFACE_STYLE'; style: 'kid' | 'minimal' }
    | { type: 'SET_RANDOMIZE'; value: boolean }
    | { type: 'SET_TOPIC'; topic: Topic | null }
    | { type: 'SET_QUESTIONS'; questions: Question[] }
    | { type: 'SET_LOADING'; isLoading: boolean }
    | { type: 'SELECT_ANSWER'; answerId: string }
    | { type: 'SUBMIT_ANSWER'; isCorrect: boolean; xpEarned: number }
    | { type: 'NEXT_QUESTION' }
    | { type: 'PREVIOUS_QUESTION' }
    | { type: 'SKIP_QUESTION' }
    | { type: 'SET_TYPED_ANSWER'; answer: string }
    | { type: 'ADD_WRONG_ANSWER'; payload: WrongAnswer }
    | { type: 'SET_TIME_LEFT'; time: number }
    | { type: 'TICK_TIMER' }
    | { type: 'SET_KNOW_MORE_USED' }
    | { type: 'TOGGLE_KNOW_MORE_POPUP'; show: boolean }
    | { type: 'RESET_QUIZ' }
    | { type: 'RESTORE_PROGRESS'; data: Partial<QuizState> }
    | { type: 'SET_WORKSHEET'; topicId: string; worksheetId: string }
    | { type: 'SET_TILE_CONFIG'; tileIndex: number; worksheetId: string }
    | { type: 'SET_CURRENT_WORKSHEET_NAME'; name: string }
    | { type: 'SET_GLOBAL_DIFFICULTY'; difficulty: 'None' | 'Easy' | 'Medium' | 'Hard' }
    | { type: 'SET_TILE_NAME'; tileIndex: number; name: string };

// Initial state
const initialState: QuizState = {
    currentScreen: 'login',
    playerName: '',
    selectedMascot: 'unicorn',
    interfaceStyle: 'kid',
    randomize: true,
    selectedTopic: null,
    currentQuestionIndex: 0,
    questions: [],
    selectedAnswer: null,
    typedAnswer: '',
    userAnswers: [],
    correctAnswers: 0,
    skippedCount: 0,
    wrongAnswers: [],
    quizScore: 0,
    timeLeft: 150,
    isLoadingQuestions: false,
    questionAnswered: false,
    usedKnowMoreBeforeAnswer: false,
    showKnowMorePopup: false,
    worksheetSettings: {},
    tileSettings: {
        1: 'ws1', // Verbs
        2: 'ws3', // Tenses
        3: 'ws2', // Adverbs
        4: 'ws4', // Articles
        5: 'ws5', // Punctuation
        6: 'ws6', // Poetry
        7: 'ws7', // Fractions
    },
    currentWorksheetName: undefined,
    globalDifficulty: 'None',
    tileNames: {},
};

// Reducer
function quizReducer(state: QuizState, action: QuizAction): QuizState {
    switch (action.type) {
        case 'SET_SCREEN':
            return { ...state, currentScreen: action.screen };
        case 'SET_PLAYER_NAME':
            return { ...state, playerName: action.name };
        case 'SET_MASCOT':
            return { ...state, selectedMascot: action.mascotId };
        case 'SET_INTERFACE_STYLE':
            return { ...state, interfaceStyle: action.style };
        case 'SET_RANDOMIZE':
            return { ...state, randomize: action.value };
        case 'SET_TOPIC':
            return { ...state, selectedTopic: action.topic };
        case 'SET_QUESTIONS':
            return {
                ...state,
                questions: action.questions,
                currentQuestionIndex: 0,
                correctAnswers: 0,
                skippedCount: 0,
                wrongAnswers: [],
                quizScore: 0,
                userAnswers: [],
                selectedAnswer: null,
                typedAnswer: '',
                questionAnswered: false,
                usedKnowMoreBeforeAnswer: false,
                showKnowMorePopup: false,
                timeLeft: 150, // Reset timer
            };
        case 'SET_LOADING':
            return { ...state, isLoadingQuestions: action.isLoading };
        case 'SELECT_ANSWER':
            return { ...state, selectedAnswer: action.answerId };
        case 'SUBMIT_ANSWER':
            return {
                ...state,
                questionAnswered: true,
                correctAnswers: action.isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
                quizScore: action.isCorrect ? state.quizScore + 10 : state.quizScore,
                userAnswers: [
                    ...state.userAnswers.filter(a => a.questionIndex !== state.currentQuestionIndex),
                    {
                        questionIndex: state.currentQuestionIndex,
                        selectedAnswer: state.selectedAnswer,
                        typedAnswer: state.typedAnswer,
                        isCorrect: action.isCorrect,
                    },
                ],
            };
        case 'NEXT_QUESTION': {
            const newIndex = state.currentQuestionIndex + 1;
            const saved = state.userAnswers.find(a => a.questionIndex === newIndex);
            return {
                ...state,
                currentQuestionIndex: newIndex,
                selectedAnswer: saved?.selectedAnswer || null,
                typedAnswer: saved?.typedAnswer || '',
                questionAnswered: !!saved,
                usedKnowMoreBeforeAnswer: false,
                showKnowMorePopup: false,
            };
        }
        case 'PREVIOUS_QUESTION': {
            const newIndex = Math.max(0, state.currentQuestionIndex - 1);
            const saved = state.userAnswers.find(a => a.questionIndex === newIndex);
            return {
                ...state,
                currentQuestionIndex: newIndex,
                selectedAnswer: saved?.selectedAnswer || null,
                typedAnswer: saved?.typedAnswer || '',
                questionAnswered: !!saved,
                usedKnowMoreBeforeAnswer: false,
                showKnowMorePopup: false,
            };
        }
        case 'SKIP_QUESTION':
            return {
                ...state,
                currentQuestionIndex: state.currentQuestionIndex + 1,
                selectedAnswer: null,
                typedAnswer: '',
                skippedCount: state.skippedCount + 1,
                questionAnswered: false,
                usedKnowMoreBeforeAnswer: false,
                showKnowMorePopup: false,
            };
        case 'SET_TYPED_ANSWER':
            return { ...state, typedAnswer: action.answer };
        case 'ADD_WRONG_ANSWER':
            // Avoid duplicates
            if (state.wrongAnswers.some(w => w.questionId === action.payload.questionId)) {
                return state;
            }
            return {
                ...state,
                wrongAnswers: [...state.wrongAnswers, action.payload],
            };
        case 'SET_TIME_LEFT':
            return { ...state, timeLeft: action.time };
        case 'TICK_TIMER':
            return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };
        case 'SET_KNOW_MORE_USED':
            return { ...state, usedKnowMoreBeforeAnswer: true };
        case 'TOGGLE_KNOW_MORE_POPUP':
            return { ...state, showKnowMorePopup: action.show };
        case 'RESET_QUIZ':
            return {
                ...state,
                currentQuestionIndex: 0,
                questions: [],
                selectedAnswer: null,
                typedAnswer: '',
                userAnswers: [],
                correctAnswers: 0,
                skippedCount: 0,
                wrongAnswers: [],
                quizScore: 0,
                timeLeft: 150,
                questionAnswered: false,
                usedKnowMoreBeforeAnswer: false,
                showKnowMorePopup: false,
                selectedTopic: null,
            };
        case 'RESTORE_PROGRESS':
            return { ...state, ...action.data };
        case 'SET_WORKSHEET':
            return {
                ...state,
                worksheetSettings: {
                    ...state.worksheetSettings,
                    [action.topicId]: action.worksheetId
                }
            };
        case 'SET_TILE_CONFIG':
            return {
                ...state,
                tileSettings: {
                    ...state.tileSettings,
                    [action.tileIndex]: action.worksheetId
                }
            };
        case 'SET_CURRENT_WORKSHEET_NAME':
            return { ...state, currentWorksheetName: action.name };
        case 'SET_GLOBAL_DIFFICULTY':
            return { ...state, globalDifficulty: action.difficulty };
        case 'SET_TILE_NAME':
            return {
                ...state,
                tileNames: {
                    ...state.tileNames,
                    [action.tileIndex]: action.name
                }
            };
        default:
            return state;
    }
}

// Context
interface QuizContextValue {
    state: QuizState;
    dispatch: React.Dispatch<QuizAction>;
    mascots: Mascot[];
    currentMascot: Mascot | undefined;
    currentQuestion: Question | undefined;
    stats: ReturnType<typeof useUserStats>;
    progress: ReturnType<typeof useQuizProgress>;
}

const QuizContext = createContext<QuizContextValue | null>(null);

// Provider
interface QuizProviderProps {
    children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
    const [state, dispatch] = useReducer(quizReducer, initialState);
    const stats = useUserStats();
    const progress = useQuizProgress();

    // Load saved player name and mascot on mount
    const [savedPlayerName] = useLocalStorage('player-name', '');
    const [savedMascot] = useLocalStorage('selected-mascot', 'unicorn');
    const [savedWorksheetSettings] = useLocalStorage('worksheet-settings', {});
    const [savedTileSettings] = useLocalStorage('tile-settings', {});
    const [savedGlobalDifficulty] = useLocalStorage('global-difficulty', 'None');
    const [savedTileNames] = useLocalStorage('tile-names', {});

    useEffect(() => {
        if (savedPlayerName) {
            dispatch({ type: 'SET_PLAYER_NAME', name: savedPlayerName });
        }
        if (savedMascot) {
            dispatch({ type: 'SET_MASCOT', mascotId: savedMascot });
        }
        if (savedWorksheetSettings && Object.keys(savedWorksheetSettings).length > 0) {
            // Restore all saved settings
            Object.entries(savedWorksheetSettings).forEach(([tId, wId]) => {
                dispatch({ type: 'SET_WORKSHEET', topicId: tId, worksheetId: wId as string });
            });
        }
        if (savedTileSettings && Object.keys(savedTileSettings).length > 0) {
            Object.entries(savedTileSettings).forEach(([idx, wId]) => {
                 dispatch({ type: 'SET_TILE_CONFIG', tileIndex: parseInt(idx), worksheetId: wId as string });
            });
        }
        if (savedGlobalDifficulty) {
            dispatch({ type: 'SET_GLOBAL_DIFFICULTY', difficulty: savedGlobalDifficulty as any });
        }
        if (savedTileNames && Object.keys(savedTileNames).length > 0) {
             Object.entries(savedTileNames).forEach(([idx, name]) => {
                 dispatch({ type: 'SET_TILE_NAME', tileIndex: parseInt(idx), name: name as string });
             });
        }
    }, [savedPlayerName, savedMascot]);

    // Save settings when they change
    useEffect(() => {
        if (Object.keys(state.worksheetSettings).length > 0) {
            localStorage.setItem('worksheet-settings', JSON.stringify(state.worksheetSettings));
        }
    }, [state.worksheetSettings]);

    useEffect(() => {
        if (Object.keys(state.tileSettings).length > 0) {
            localStorage.setItem('tile-settings', JSON.stringify(state.tileSettings));
        }
    }, [state.tileSettings]);

    useEffect(() => {
        localStorage.setItem('global-difficulty', state.globalDifficulty);
    }, [state.globalDifficulty]);

    useEffect(() => {
        if (Object.keys(state.tileNames).length > 0) {
            localStorage.setItem('tile-names', JSON.stringify(state.tileNames));
        }
    }, [state.tileNames]);

    // Timer effect
    useEffect(() => {
        if (state.currentScreen === 'question' && state.timeLeft > 0) {
            const timer = setInterval(() => {
                dispatch({ type: 'TICK_TIMER' });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [state.currentScreen, state.timeLeft]);

    // Update streak when landing
    useEffect(() => {
        if (state.currentScreen === 'landing') {
            stats.updateStreak();
        }
    }, [state.currentScreen]);

    const currentMascot = MASCOTS.find(m => m.id === state.selectedMascot);
    const currentQuestion = state.questions[state.currentQuestionIndex];

    const value: QuizContextValue = {
        state,
        dispatch,
        mascots: MASCOTS,
        currentMascot,
        currentQuestion,
        stats,
        progress,
    };

    return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

// Hook
export function useQuiz() {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
}
