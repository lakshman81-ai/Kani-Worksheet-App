import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import QuestionScreen from '../screens/QuestionScreen';

// Mock contexts and hooks
const mockDispatch = vi.fn();
const mockStats = { stats: { xp: 100 } };
const mockAudio = { playCorrect: vi.fn(), playIncorrect: vi.fn(), playSuccess: vi.fn() };

vi.mock('../../context/QuizContext', () => ({
    useQuiz: () => ({
        state: {
            questions: [{ id: 'q1', text: 'Test Question', correctAnswer: 'A' }],
            currentQuestionIndex: 0,
            selectedTopic: { name: 'Test Topic', icon: '🚀', color: '#000' },
            selectedAnswer: null,
            typedAnswer: '',
            skippedCount: 0,
            timeLeft: 60,
            wrongAnswers: [],
            // Ensure popup is false initially
            showKnowMorePopup: false,
        },
        dispatch: mockDispatch,
        currentMascot: { emoji: '🦄' },
        currentQuestion: {
            id: 'q1',
            text: 'Test Question',
            correctAnswer: 'A',
            answers: [{ id: 'A', text: 'Option A' }, { id: 'B', text: 'Option B' }],
            questionType: 'MCQ',
            knowMore: 'http://example.com',
            knowMoreText: 'Learn more here',
        },
        stats: mockStats,
    }),
}));

vi.mock('../../hooks/useAudioFeedback', () => ({
    useAudioFeedback: () => mockAudio,
}));

vi.mock('../modals/KnowMoreModal', () => ({
    default: () => <div data-testid="know-more-modal">Know More Modal</div>,
}));

describe('QuestionScreen', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('does NOT show Settings icon or Zoom button', () => {
        render(<QuestionScreen />);

        const settingsButton = screen.queryByLabelText('Settings');
        expect(settingsButton).not.toBeInTheDocument();

        const zoomButton = screen.queryByText(/Zoom/i);
        expect(zoomButton).not.toBeInTheDocument();
    });

    it('shows Sound button and Close button', () => {
        render(<QuestionScreen />);

        expect(screen.getByLabelText('Sound')).toBeInTheDocument();
        expect(screen.getByLabelText('Close quiz')).toBeInTheDocument();
    });

    it('displays Correct MCQ tag', () => {
        render(<QuestionScreen />);
        expect(screen.getByText(/MCQ/i)).toBeInTheDocument();
    });

    it('does NOT automatically show Know More popup', () => {
        render(<QuestionScreen />);
        expect(screen.queryByTestId('know-more-modal')).not.toBeInTheDocument();
    });

    it('handles answer selection', () => {
        render(<QuestionScreen />);

        const optionA = screen.getByText('Option A');
        fireEvent.click(optionA);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'SELECT_ANSWER',
            answerId: 'A'
        });
    });
});
