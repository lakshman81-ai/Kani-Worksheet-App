import React, { useState, useEffect } from 'react';
import type { Question } from '../../types';
import MatchRow from './MatchRow';
import styles from '../../styles/MatchFollowingQuestion.module.css';

interface MatchFollowingQuestionProps {
  question: Question;
  isSubmitted: boolean;
  userMappingsStr: string; // JSON string of mappings
  onUpdate: (mappings: Record<string, string>) => void;
}

const MatchFollowingQuestion: React.FC<MatchFollowingQuestionProps> = ({
  question,
  isSubmitted,
  userMappingsStr,
  onUpdate
}) => {
  const [mappings, setMappings] = useState<Record<string, string>>({});

  // Sync from props (e.g. when coming back to question or init)
  useEffect(() => {
    try {
      if (userMappingsStr) {
        setMappings(JSON.parse(userMappingsStr));
      } else {
        setMappings({});
      }
    } catch (e) {
      console.error("Failed to parse mappings", e);
      setMappings({});
    }
  }, [userMappingsStr]);

  if (!question.matchColumnA || !question.matchColumnB) {
    return <div className={styles.matchQuestionContainer}>Error: Missing match data</div>;
  }

  const handleMappingChange = (aId: string, bId: string) => {
    const newMappings = { ...mappings, [aId]: bId };
    setMappings(newMappings);
    onUpdate(newMappings);
  };

  // Determine correctness for feedback
  const getIsCorrect = (aId: string, bId: string) => {
    const pair = question.matchCorrectPairs?.find(p => p.aId === aId);
    return pair ? pair.bId === bId : false;
  };

  const getCorrectBId = (aId: string) => {
    const pair = question.matchCorrectPairs?.find(p => p.aId === aId);
    return pair ? pair.bId : undefined;
  };

  return (
    <div className={styles.matchQuestionContainer}>
      <div className={styles.questionText}>Match the Following</div>
      <div className={styles.instructionText}>
        Select the correct match from the dropdown for each item.
      </div>

      <div className={styles.columnHeaders}>
        <div className={styles.columnHeader}>Column A</div>
        <div className={styles.spacer}></div>
        <div className={styles.columnHeader}>Column B</div>
      </div>

      {question.matchColumnA.map(itemA => (
        <MatchRow
          key={itemA.id}
          itemA={itemA}
          columnBItems={question.matchColumnB!}
          selectedBId={mappings[itemA.id]}
          isDisabled={isSubmitted}
          isCorrect={isSubmitted && getIsCorrect(itemA.id, mappings[itemA.id])}
          correctBId={isSubmitted ? getCorrectBId(itemA.id) : undefined}
          onChange={(bId) => handleMappingChange(itemA.id, bId)}
        />
      ))}
    </div>
  );
};

export default MatchFollowingQuestion;
