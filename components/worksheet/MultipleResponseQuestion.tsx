import React, { useMemo } from 'react';
import { Question } from '../../types';
import CheckboxOption from './CheckboxOption';
import FeedbackPanel from './FeedbackPanel';
import { validateWithPartialCredit, getFeedbackMessage } from '../../utils/questionValidation';

interface MultipleResponseQuestionProps {
  question: Question;
  selectedIds: string[];
  isSubmitted: boolean;
  onToggle: (id: string) => void;
}

const MultipleResponseQuestion: React.FC<MultipleResponseQuestionProps> = ({
  question,
  selectedIds,
  isSubmitted,
  onToggle,
}) => {
  const validationResult = useMemo(() => {
    if (!isSubmitted) return null;
    return validateWithPartialCredit(selectedIds, question.correctAnswerIds || []);
  }, [selectedIds, question.correctAnswerIds, isSubmitted]);

  const feedbackMessage = useMemo(() => {
    if (!validationResult) return null;
    return getFeedbackMessage(validationResult, question.feedback);
  }, [validationResult, question.feedback]);

  return (
    <div className="multiple-response-question" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <p style={{
            color: '#fff',
            fontSize: '1.2rem',
            textAlign: 'center',
            marginBottom: '20px',
            fontStyle: 'italic',
            opacity: 0.9
        }}>
            (Select all that apply)
        </p>

      <div className="options-grid" role="group" aria-label="Answer options">
        {question.options?.map((option) => (
          <CheckboxOption
            key={option.id}
            option={option}
            isChecked={selectedIds.includes(option.id)}
            isDisabled={isSubmitted}
            showCorrectness={isSubmitted}
            onChange={(id) => onToggle(id)}
          />
        ))}
      </div>

      {isSubmitted && feedbackMessage && validationResult && (
        <FeedbackPanel
            feedback={{
                message: feedbackMessage.message,
                type: feedbackMessage.type,
                details: {
                    correctSelections: validationResult.correctSelections,
                    incorrectSelections: validationResult.incorrectSelections,
                    missedAnswers: validationResult.missedAnswers
                }
            }}
        />
      )}
    </div>
  );
};

export default MultipleResponseQuestion;
