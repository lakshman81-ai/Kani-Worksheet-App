import { describe, it, expect } from 'vitest';
import { validateWithPartialCredit, getFeedbackMessage, ValidationResult } from '../questionValidation';

describe('validateWithPartialCredit', () => {
    it('should return fully correct for exact match', () => {
        const correctIds = ['a', 'c'];
        const selectedIds = ['a', 'c'];
        const result = validateWithPartialCredit(selectedIds, correctIds);

        expect(result.isFullyCorrect).toBe(true);
        expect(result.score).toBe(1);
        expect(result.correctSelections).toEqual(['a', 'c']);
        expect(result.incorrectSelections).toEqual([]);
        expect(result.missedAnswers).toEqual([]);
    });

    it('should handle partial credit (missing one)', () => {
        const correctIds = ['a', 'c', 'e'];
        const selectedIds = ['a', 'c'];
        const result = validateWithPartialCredit(selectedIds, correctIds);

        expect(result.isFullyCorrect).toBe(false);
        expect(result.score).toBeCloseTo(0.67, 2);
        expect(result.correctSelections).toEqual(['a', 'c']);
        expect(result.incorrectSelections).toEqual([]);
        expect(result.missedAnswers).toEqual(['e']);
    });

    it('should handle incorrect selections (penalty)', () => {
        const correctIds = ['a', 'c'];
        const selectedIds = ['a', 'b']; // 'b' is wrong
        const result = validateWithPartialCredit(selectedIds, correctIds);

        expect(result.isFullyCorrect).toBe(false);
        // Correct: 1/2 = 0.5. Penalty: 1 * (1/2) = 0.5. Score = 0?
        // Wait, my logic was:
        // score = correctSelections.length / correctIds.length
        // penaltyPerWrong = 1 / correctIds.length
        // score -= incorrectSelections.length * penaltyPerWrong
        // So: 1/2 - (1 * 1/2) = 0.
        expect(result.score).toBe(0);
        expect(result.correctSelections).toEqual(['a']);
        expect(result.incorrectSelections).toEqual(['b']);
        expect(result.missedAnswers).toEqual(['c']);
    });

    it('should not allow negative score', () => {
        const correctIds = ['a'];
        const selectedIds = ['b', 'c']; // 2 wrong
        const result = validateWithPartialCredit(selectedIds, correctIds);

        expect(result.score).toBe(0);
        expect(result.incorrectSelections).toEqual(['b', 'c']);
    });

    it('should handle empty selection', () => {
        const correctIds = ['a'];
        const selectedIds: string[] = [];
        const result = validateWithPartialCredit(selectedIds, correctIds);

        expect(result.isFullyCorrect).toBe(false);
        expect(result.score).toBe(0);
        expect(result.missedAnswers).toEqual(['a']);
    });
});

describe('getFeedbackMessage', () => {
    const feedbackConfig = {
        allCorrect: 'Perfect!',
        partial: 'Almost there!',
        allWrong: 'Try again.'
    };

    it('should return success message for full correct', () => {
        const result: ValidationResult = {
            isFullyCorrect: true,
            score: 1,
            correctSelections: ['a'],
            incorrectSelections: [],
            missedAnswers: [],
            details: { got: 1, total: 1, wrong: 0 }
        };
        const msg = getFeedbackMessage(result, feedbackConfig);
        expect(msg.message).toBe('Perfect!');
        expect(msg.type).toBe('success');
    });

    it('should return error message for all wrong', () => {
        const result: ValidationResult = {
            isFullyCorrect: false,
            score: 0,
            correctSelections: [],
            incorrectSelections: ['b'],
            missedAnswers: ['a'],
            details: { got: 0, total: 1, wrong: 1 }
        };
        const msg = getFeedbackMessage(result, feedbackConfig);
        expect(msg.message).toBe('Try again.');
        expect(msg.type).toBe('error');
    });

    it('should return partial message for mixed results', () => {
        const result: ValidationResult = {
            isFullyCorrect: false,
            score: 0.5,
            correctSelections: ['a'],
            incorrectSelections: [],
            missedAnswers: ['b'],
            details: { got: 1, total: 2, wrong: 0 }
        };
        const msg = getFeedbackMessage(result, feedbackConfig);
        expect(msg.message).toBe('Almost there!');
        expect(msg.type).toBe('warning');
    });
});
