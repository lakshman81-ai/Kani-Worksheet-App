import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TrueFalseQuestion from '../worksheet/TrueFalseQuestion';
import { Question } from '../../types';
import '@testing-library/jest-dom';

// Mock CSS modules
vi.mock('../../styles/TrueFalseQuestion.module.css', () => ({
    default: {
        container: 'container',
        optionsContainer: 'optionsContainer',
        optionCard: 'optionCard',
        selected: 'selected',
        disabled: 'disabled',
        correct: 'correct',
        wrong: 'wrong',
        icon: 'icon',
        text: 'text',
        feedbackIcon: 'feedbackIcon'
    }
}));

describe('TrueFalseQuestion', () => {
    const mockQuestion: Question = {
        id: '1',
        text: 'The sky is blue',
        answers: [
            { id: 'true', text: 'True' },
            { id: 'false', text: 'False' }
        ],
        correctAnswer: 'true',
        topic: 'science',
        questionType: 'TF'
    };

    it('renders question options correctly', () => {
        render(
            <TrueFalseQuestion
                question={mockQuestion}
                selectedAnswer={null}
                isSubmitted={false}
                onAnswer={() => {}}
            />
        );
        expect(screen.getByText('True')).toBeInTheDocument();
        expect(screen.getByText('False')).toBeInTheDocument();
    });

    it('calls onAnswer when option is clicked', () => {
        const handleAnswer = vi.fn();
        render(
            <TrueFalseQuestion
                question={mockQuestion}
                selectedAnswer={null}
                isSubmitted={false}
                onAnswer={handleAnswer}
            />
        );

        fireEvent.click(screen.getByText('True'));
        expect(handleAnswer).toHaveBeenCalledWith('true');
    });

    it('disables interaction when submitted', () => {
        const handleAnswer = vi.fn();
        render(
            <TrueFalseQuestion
                question={mockQuestion}
                selectedAnswer='true'
                isSubmitted={true}
                onAnswer={handleAnswer}
            />
        );

        fireEvent.click(screen.getByText('False'));
        expect(handleAnswer).not.toHaveBeenCalled();
    });
});
