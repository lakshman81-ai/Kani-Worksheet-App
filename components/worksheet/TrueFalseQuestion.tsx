import React from 'react';
import { Question } from '../../types';
import styles from '../../styles/TrueFalseQuestion.module.css';

interface TrueFalseQuestionProps {
    question: Question;
    selectedAnswer: string | null;
    isSubmitted: boolean;
    onAnswer: (answerId: string) => void;
}

export default function TrueFalseQuestion({
    question,
    selectedAnswer,
    isSubmitted,
    onAnswer
}: TrueFalseQuestionProps) {
    const trueOption = question.answers.find(a => a.id === 'true') || { id: 'true', text: 'True' };
    const falseOption = question.answers.find(a => a.id === 'false') || { id: 'false', text: 'False' };

    const handleSelect = (id: string) => {
        if (!isSubmitted) {
            onAnswer(id);
        }
    };

    const getOptionClass = (id: string) => {
        let className = styles.optionCard;

        if (selectedAnswer === id) {
            className += ` ${styles.selected}`;
        }

        if (isSubmitted) {
            className += ` ${styles.disabled}`;

            // Normalize for comparison
            const correctIds = question.correctAnswer.split('|').map(s => s.trim().toLowerCase());
            const isCorrectAnswer = correctIds.includes(id.toLowerCase());
            const isUserSelection = selectedAnswer === id;

            if (isCorrectAnswer) {
                className += ` ${styles.correct}`;
            } else if (isUserSelection && !isCorrectAnswer) {
                className += ` ${styles.wrong}`;
            }
        }

        return className;
    };

    return (
        <div className={styles.container}>
            <div className={styles.optionsContainer}>
                {/* TRUE Option */}
                <div
                    className={getOptionClass('true')}
                    onClick={() => handleSelect('true')}
                    role="button"
                    tabIndex={0}
                    aria-label="True"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleSelect('true');
                        }
                    }}
                >
                    <span className={styles.icon}>✅</span>
                    <span className={styles.text}>{trueOption.text}</span>
                    {isSubmitted && question.correctAnswer.toLowerCase() === 'true' && (
                        <div className={styles.feedbackIcon}>✓</div>
                    )}
                     {isSubmitted && selectedAnswer === 'true' && question.correctAnswer.toLowerCase() !== 'true' && (
                        <div className={styles.feedbackIcon}>✗</div>
                    )}
                </div>

                {/* FALSE Option */}
                <div
                    className={getOptionClass('false')}
                    onClick={() => handleSelect('false')}
                    role="button"
                    tabIndex={0}
                    aria-label="False"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleSelect('false');
                        }
                    }}
                >
                    <span className={styles.icon}>❌</span>
                    <span className={styles.text}>{falseOption.text}</span>
                    {isSubmitted && question.correctAnswer.toLowerCase() === 'false' && (
                        <div className={styles.feedbackIcon}>✓</div>
                    )}
                     {isSubmitted && selectedAnswer === 'false' && question.correctAnswer.toLowerCase() !== 'false' && (
                        <div className={styles.feedbackIcon}>✗</div>
                    )}
                </div>
            </div>
        </div>
    );
}
