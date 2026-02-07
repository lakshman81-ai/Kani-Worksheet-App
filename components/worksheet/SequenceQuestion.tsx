import React, { useMemo } from 'react';
import SequenceItem from './SequenceItem';
import styles from '../../styles/SequenceQuestion.module.css';
import { Question } from '../../types';

interface SequenceQuestionProps {
  question: Question;
  onUpdate: (answer: string) => void;
  isSubmitted: boolean;
  typedAnswer: string;
}

export const validateSequence = (userPositions: Record<string, number | ''>, totalItems: number): boolean => {
  const values = Object.values(userPositions).filter(v => v !== '') as number[];
  if (values.length !== totalItems) return false;

  // Check for duplicates
  const set = new Set(values);
  if (set.size !== totalItems) return false;

  // Check range
  return values.every(v => v >= 1 && v <= totalItems);
};

export const getSequenceString = (userPositions: Record<string, number | ''>, items: {id: string}[]): string => {
  // Convert positions map to sequence string (e.g. "2,4,1,3")
  const posToId: Record<number, string> = {};
  Object.entries(userPositions).forEach(([itemId, pos]) => {
      if (pos !== '') {
          posToId[pos as number] = itemId;
      }
  });

  const sequence: string[] = [];
  for (let i = 1; i <= items.length; i++) {
      sequence.push(posToId[i] || '?');
  }
  return sequence.join(',');
};

const SequenceQuestion: React.FC<SequenceQuestionProps> = ({
  question,
  onUpdate,
  isSubmitted,
  typedAnswer,
}) => {
  const userPositions = useMemo(() => {
    if (!typedAnswer) return {};
    try {
      return JSON.parse(typedAnswer);
    } catch (e) {
      return {};
    }
  }, [typedAnswer]);

  const error = useMemo(() => {
    if (isSubmitted) return null;
    const values = Object.values(userPositions).filter(v => v !== '') as number[];
    const set = new Set(values);

    if (set.size !== values.length) {
      return 'Duplicate numbers found!';
    } else if (values.some(v => v < 1 || v > question.answers.length)) {
      return `Numbers must be between 1 and ${question.answers.length}`;
    }
    return null;
  }, [userPositions, isSubmitted, question.answers.length]);

  const handlePositionChange = (itemId: string, val: string) => {
    const num = val === '' ? '' : parseInt(val, 10);

    const newPositions = {
      ...userPositions,
      [itemId]: num
    };

    onUpdate(JSON.stringify(newPositions));
  };

  const getCorrectPosition = (itemId: string): number | null => {
    if (!isSubmitted) return null;
    // correctAnswer is comma-separated list of item IDs in correct order
    // e.g. "2,4,1,3" -> Item 2 is 1st, Item 4 is 2nd...
    const correctOrder = question.correctAnswer.split(',').map(s => s.trim());
    const index = correctOrder.indexOf(itemId);
    return index !== -1 ? index + 1 : null;
  };

  return (
    <div className={styles.sequenceQuestionContainer}>
      <div className={styles.sequenceItemsList}>
        {question.answers.map((item) => {
           const pos = userPositions[item.id];
           const correctPos = getCorrectPosition(item.id);
           const isCorrect = isSubmitted && pos === correctPos;

           return (
            <SequenceItem
                key={item.id}
                item={item}
                userPosition={pos === undefined ? '' : pos}
                correctPosition={correctPos}
                isDisabled={isSubmitted}
                isCorrect={isSubmitted ? isCorrect : undefined}
                onChange={(val) => handlePositionChange(item.id, val)}
                totalItems={question.answers.length}
            />
           );
        })}
      </div>

      {error && (
        <div className={styles.errorFeedback}>
          {error}
        </div>
      )}
    </div>
  );
};

export default SequenceQuestion;
