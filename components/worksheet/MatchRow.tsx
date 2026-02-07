import React from 'react';
import type { MatchItem } from '../../types';
import ColumnItem from './ColumnItem';
import styles from '../../styles/MatchFollowingQuestion.module.css';

interface MatchRowProps {
  itemA: MatchItem;
  columnBItems: MatchItem[];
  selectedBId?: string;
  isDisabled: boolean;
  isCorrect?: boolean;
  correctBId?: string;
  onChange: (bId: string) => void;
}

const MatchRow: React.FC<MatchRowProps> = ({
  itemA,
  columnBItems,
  selectedBId,
  isDisabled,
  isCorrect,
  correctBId,
  onChange
}) => {
  const getRowClassName = () => {
    let base = styles.matchRow;
    if (isDisabled) {
      if (isCorrect) base = `${styles.matchRow} ${styles.matchRowCorrect}`;
      else base = `${styles.matchRow} ${styles.matchRowIncorrect}`;
    }
    return base;
  };

  const selectedItemB = columnBItems.find(i => i.id === selectedBId);
  const correctItemB = correctBId ? columnBItems.find(i => i.id === correctBId) : null;

  return (
    <div className={getRowClassName()}>
      {/* Column A Item */}
      <div className={styles.columnAItem}>
        <ColumnItem item={itemA} />
      </div>

      {/* Dropdown Selector */}
      <div className={styles.selectorContainer}>
        {/* Mobile: Use smaller text or icon */}
        <select
          value={selectedBId || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className={styles.matchSelector}
          aria-label={`Select match for ${itemA.text}`}
        >
          <option value="">Select...</option>
          {columnBItems.map(itemB => (
            <option key={itemB.id} value={itemB.id}>
              {itemB.text}
            </option>
          ))}
        </select>

        {isDisabled && !isCorrect && correctItemB && (
          <div style={{
            color: '#27ae60',
            fontSize: '0.85rem',
            marginTop: '8px',
            fontWeight: 'bold',
            padding: '4px 8px',
            background: '#e8f5e9',
            borderRadius: '4px'
          }}>
            Correct: {correctItemB.text}
          </div>
        )}
      </div>

      {/* Column B Preview (Confirm Selection) */}
      <div className={styles.columnBPreview}>
         {selectedItemB ? (
             <ColumnItem item={selectedItemB} />
         ) : (
             <span style={{ color: '#bdc3c7', fontSize: '2rem' }}>?</span>
         )}
      </div>
    </div>
  );
};

export default MatchRow;
