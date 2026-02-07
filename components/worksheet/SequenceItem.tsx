import React from 'react';
import styles from '../../styles/SequenceQuestion.module.css';

interface SequenceItemProps {
  item: { id: string; text: string };
  userPosition: number | '';
  correctPosition?: number | null;
  isDisabled: boolean;
  isCorrect?: boolean;
  onChange: (position: string) => void;
  totalItems: number;
}

const SequenceItem: React.FC<SequenceItemProps> = ({
  item,
  userPosition,
  correctPosition,
  isDisabled,
  isCorrect,
  onChange,
  totalItems,
}) => {
  const getItemClassName = () => {
    let base = styles.sequenceItem;
    if (!isDisabled) return base;

    // Add correct/incorrect styles
    if (isCorrect) {
      base += ` ${styles.correct}`;
    } else {
      base += ` ${styles.incorrect}`;
    }
    return base;
  };

  return (
    <div className={getItemClassName()}>
      <div className={styles.positionInputContainer}>
        <input
          type="number"
          min="1"
          max={totalItems}
          value={userPosition}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className={styles.positionInput}
          placeholder="#"
          aria-label={`Position for: ${item.text}`}
        />
      </div>

      <div className={styles.itemContent}>
        {item.text}
      </div>

      {isDisabled && !isCorrect && correctPosition && (
        <div className={styles.correctPositionHint}>
          ✓ Should be: {correctPosition}
        </div>
      )}
    </div>
  );
};

export default SequenceItem;
