export interface ValidationResult {
  isFullyCorrect: boolean;
  score: number; // 0 to 1
  correctSelections: string[];
  incorrectSelections: string[];
  missedAnswers: string[];
  details: {
    got: number;
    total: number;
    wrong: number;
  };
}

export interface FeedbackMessage {
  message: string;
  type: 'success' | 'warning' | 'error';
}

/**
 * Validates a multiple response answer against the correct answer IDs.
 * Uses partial credit logic.
 */
export function validateWithPartialCredit(
  selectedIds: string[],
  correctIds: string[]
): ValidationResult {
  const selectedSet = new Set(selectedIds);
  const correctSet = new Set(correctIds);

  const correctSelections = selectedIds.filter((id) => correctSet.has(id));
  const incorrectSelections = selectedIds.filter((id) => !correctSet.has(id));
  const missedAnswers = correctIds.filter((id) => !selectedSet.has(id));

  const isFullyCorrect =
    selectedIds.length === correctIds.length &&
    correctSelections.length === correctIds.length;

  // Calculate score
  // Penalize for incorrect selections?
  // Strategy: (correctly selected) / (total correct) - (incorrectly selected penalty)?
  // Guide says: score = correctSelections.length / correct.length (for partial)
  // But if I select everything, I get 100%? No, usually wrong answers should penalize or cap.
  // Guide Strategy B: score: correctSelections.length / correct.length
  // This is simple but allows gaming by selecting all.

  // Let's implement a slightly robust version:
  // Score = Max(0, (Correct Selected - Incorrect Selected) / Total Correct)
  // Or just stick to the guide's simple logic for Grade 3?
  // Guide says: "Partial credit: how many correct selections?"
  // "isFullyCorrect, score: isFullyCorrect ? 1 : (correctSelections.length / correct.length)"

  // I will use a balanced approach:
  // Each correct selection adds 1 point.
  // Each incorrect selection subtracts 0.5 point (or 1 point).
  // Normalized to 0-1 range.

  // However, sticking to the guide's exact recommendation first:
  // "score: isFullyCorrect ? 1 : (correctSelections.length / correct.length)"
  // But I will add a check: if incorrectSelections > 0, score cannot be 1.

  let score = 0;
  if (correctIds.length > 0) {
      score = correctSelections.length / correctIds.length;
      // Simple penalty: if you have wrong answers, you can't get perfect score.
      // And maybe reduce score by ratio of wrong answers?
      // For Grade 3, let's keep it simple. Score is mainly for internal tracking.
      // But let's handle the case where they select ALL options.
      if (incorrectSelections.length > 0) {
          // If they selected everything, score should definitely not be 1.
          // Let's deduct 1/(total options) for each wrong answer? We don't know total options here.
          // Let's deduct 0.5 * (1/total correct) for each wrong answer.
          const penaltyPerWrong = 1 / correctIds.length;
          score = Math.max(0, score - (incorrectSelections.length * penaltyPerWrong));
      }
  }

  return {
    isFullyCorrect,
    score: parseFloat(score.toFixed(2)),
    correctSelections,
    incorrectSelections,
    missedAnswers,
    details: {
      got: correctSelections.length,
      total: correctIds.length,
      wrong: incorrectSelections.length,
    },
  };
}

/**
 * Generates feedback text based on the validation result.
 */
export function getFeedbackMessage(
  result: ValidationResult,
  questionFeedback?: { allCorrect: string; partial: string; allWrong: string }
): FeedbackMessage {
  if (result.isFullyCorrect) {
    return {
      message: questionFeedback?.allCorrect || 'Great job! You found all of them!',
      type: 'success',
    };
  }

  if (result.correctSelections.length === 0) {
    return {
      message: questionFeedback?.allWrong || "Let's try again. Look carefully at the options.",
      type: 'error',
    };
  }

  // Partial
  let message = questionFeedback?.partial || 'You got some right!';

  // Add specific details
  if (result.incorrectSelections.length > 0) {
      // message += " Some choices were not correct.";
  }
  if (result.missedAnswers.length > 0) {
      // message += " You missed some correct answers.";
  }

  return {
    message: message,
    type: 'warning',
  };
}
