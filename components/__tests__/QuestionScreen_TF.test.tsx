import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import QuestionScreen from '../screens/QuestionScreen';

// Mock contexts
const mockDispatch = vi.fn();
const mockStats = { stats: { xp: 100 }, addXp: vi.fn() };
const mockAudio = { playCorrect: vi.fn(), playIncorrect: vi.fn(), playSuccess: vi.fn() };

vi.mock('../../context/QuizContext', () => ({
    useQuiz: () => ({
        state: {
            questions: [{ id: 'q1', text: 'TF Question', correctAnswer: 'true' }],
            currentQuestionIndex: 0,
            selectedTopic: { name: 'Test Topic' },
            selectedAnswer: 'true', // Simulate user selected True
            typedAnswer: '', // Empty typed answer (which caused the bug before)
            skippedCount: 0,
            timeLeft: 60,
            wrongAnswers: [],
            questionAnswered: false,
        },
        dispatch: mockDispatch,
        currentMascot: { emoji: '🦄' },
        currentQuestion: {
            id: 'q1',
            text: 'TF Question',
            correctAnswer: 'true',
            answers: [
                { id: 'true', text: 'True' },
                { id: 'false', text: 'False' }
            ],
            questionType: 'TF',
        },
        stats: mockStats,
    }),
}));

vi.mock('../../hooks/useAudioFeedback', () => ({
    useAudioFeedback: () => mockAudio,
}));

// Mock TrueFalseQuestion to avoid complexity
vi.mock('../worksheet/TrueFalseQuestion', () => ({
    default: () => <div data-testid="tf-question">TF Component</div>
}));

describe('QuestionScreen TF Logic', () => {
    it('submits TF answer correctly using selectedAnswer', () => {
        render(<QuestionScreen />);

        // Find Submit button
        const submitButton = screen.getByText('SUBMIT');
        fireEvent.click(submitButton);

        // Expect dispatch SUBMIT_ANSWER
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: 'SUBMIT_ANSWER',
            isCorrect: true
        }));
    });
});
