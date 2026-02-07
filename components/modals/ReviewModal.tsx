import React from 'react';
import styles from '../../styles/ReviewModal.module.css';
import { WrongAnswer } from '../../types';

interface ReviewModalProps {
    wrongAnswers: WrongAnswer[];
    onClose: () => void;
}

export default function ReviewModal({ wrongAnswers, onClose }: ReviewModalProps) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <span style={{ fontSize: '28px' }}>🎓</span>
                        Learning Review
                    </h2>
                    <button onClick={onClose} className={styles.closeBtn} aria-label="Close">✕</button>
                </div>

                <div className={styles.content}>
                    {wrongAnswers.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span style={{ fontSize: '64px' }}>🎉</span>
                            <span>Amazing! No mistakes to review.</span>
                        </div>
                    ) : (
                        wrongAnswers.map((item, index) => (
                            <div key={index} className={styles.mistakeCard}>
                                <div className={styles.questionHeader}>
                                    <span className={styles.questionBadge}>Question {index + 1}</span>
                                </div>
                                <div className={styles.questionText}>
                                    {item.questionText}
                                </div>

                                <div className={styles.comparison}>
                                    <div className={`${styles.answerBox} ${styles.userAnswer}`}>
                                        <span className={styles.label}>You Answered</span>
                                        <div className={styles.answerText}>{item.userAnswerText}</div>
                                    </div>
                                    <div className={`${styles.answerBox} ${styles.correctAnswer}`}>
                                        <span className={styles.label}>Correct Answer</span>
                                        <div className={styles.answerText}>{item.correctAnswerText}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
