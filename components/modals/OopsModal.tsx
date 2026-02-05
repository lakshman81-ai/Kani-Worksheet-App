import React from 'react';
import styles from '../../styles/OopsModal.module.css';
import { WrongAnswer } from '../../types';

interface OopsModalProps {
    wrongAnswers: WrongAnswer[];
    onClose: () => void;
}

export default function OopsModal({ wrongAnswers, onClose }: OopsModalProps) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <span style={{ fontSize: '28px' }}>😅</span>
                        Oops! Review
                    </h2>
                    <button onClick={onClose} className={styles.closeBtn}>✕</button>
                </div>

                <div className={styles.content}>
                    {wrongAnswers.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>No wrong answers yet!</p>
                    ) : (
                        wrongAnswers.map((item, index) => (
                            <div key={index} className={styles.wrongItem}>
                                <span className={styles.questionNumber}>Question {index + 1}</span>
                                <div className={styles.questionText}>{item.questionText}</div>

                                <div className={styles.comparison}>
                                    <div className={`${styles.answerBox} ${styles.yourAnswer}`}>
                                        <span className={styles.label}>You Picked</span>
                                        {item.userAnswerText}
                                    </div>
                                    <div className={`${styles.answerBox} ${styles.correctAnswer}`}>
                                        <span className={styles.label}>Correct Answer</span>
                                        {item.correctAnswerText}
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
