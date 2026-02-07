import React from 'react';
import type { MatchItem } from '../../types';
import styles from '../../styles/MatchFollowingQuestion.module.css';

interface ColumnItemProps {
  item: MatchItem;
  className?: string;
}

const ColumnItem: React.FC<ColumnItemProps> = ({ item, className }) => {
  if (!item) return null;

  return (
    <div className={className || styles.columnItem} style={{ flexDirection: 'column' }}>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.text}
          className={styles.matchImage}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <span style={{ marginTop: item.imageUrl ? '8px' : '0', fontSize: '1.1rem' }}>
        {item.text}
      </span>
    </div>
  );
};

export default ColumnItem;
