import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { Topic, Question, Mascot } from '../types';
import { useLocalStorage, useUserStats, useQuizProgress } from '../hooks/useLocalStorage';

// Mascots data
export const MASCOTS: Mascot[] = [
    { id: 'unicorn', emoji: '🦄', name: 'Sparkle', color: '#e91e63', bgGradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)' },
    { id: 'panda', emoji: '🐼', name: 'Bamboo', color: '#4caf50', bgGradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' },
    { id: 'rocket', emoji: '🚀', name: 'Blaze', color: '#ff5722', bgGradient: 'linear-gradient(135deg, #fbe9e7 0%, #ffccbc 100%)' },
    { id: 'tiger', emoji: '🐯', name: 'Stripe', color: '#ff9800', bgGradient: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' },
    { id: 'koala', emoji: '🐨', name: 'Cuddles', color: '#607d8b', bgGradient: 'linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)' },
];

// Wrong answer entry for review
interface WrongAnswer {
    questionId: string;
    questionText: string;
    correctAnswer: string;
    userAnswer: string;
}

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
    userAnswers: { questionIndex: number; selectedAnswer: string; isCorrect: boolean }[];
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
    currentWorksheetName?: string;
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
    | { type: 'SET_CURRENT_WORKSHEET_NAME'; name: string };

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
    currentWorksheetName: undefined,
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
                    ...state.userAnswers,
                    {
                        questionIndex: state.currentQuestionIndex,
                        selectedAnswer: state.selectedAnswer || '',
                        isCorrect: action.isCorrect,
                    },
                ],
            };
        case 'NEXT_QUESTION':
            return {
                ...state,
                currentQuestionIndex: state.currentQuestionIndex + 1,
                selectedAnswer: null,
                typedAnswer: '',
                questionAnswered: false,
                usedKnowMoreBeforeAnswer: false,
                showKnowMorePopup: false,
            };
        case 'PREVIOUS_QUESTION':
            return {
                ...state,
                currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
                selectedAnswer: null,
                typedAnswer: '',
                questionAnswered: state.userAnswers.some(a => a.questionIndex === state.currentQuestionIndex - 1),
                usedKnowMoreBeforeAnswer: false,
                showKnowMorePopup: false,
            };
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
        case 'SET_CURRENT_WORKSHEET_NAME':
            return { ...state, currentWorksheetName: action.name };
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
    }, [savedPlayerName, savedMascot]);

    // Save settings when they change
    useEffect(() => {
        if (Object.keys(state.worksheetSettings).length > 0) {
            localStorage.setItem('worksheet-settings', JSON.stringify(state.worksheetSettings));
        }
    }, [state.worksheetSettings]);

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
