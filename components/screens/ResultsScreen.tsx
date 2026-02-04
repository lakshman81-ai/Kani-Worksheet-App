import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import styles from '../../styles/ResultsScreen.module.css';
import sharedStyles from '../../styles/shared.module.css';

interface ResultsScreenProps {
    onRetry: () => void;
}

export default function ResultsScreen({ onRetry }: ResultsScreenProps) {
    const { state, dispatch, currentMascot } = useQuiz();
    const [showReview, setShowReview] = useState(false);

    const percentage = state.questions.length > 0
        ? Math.round((state.correctAnswers / state.questions.length) * 100)
        : 0;
    const isPassing = percentage >= 60;
    const xpEarned = state.quizScore;

    return (
        <div className={styles.resultsContainer}>
            {/* Background effects */}
            <div className={sharedStyles.particlesContainer}>
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className={sharedStyles.starParticle}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Celebration emoji */}
            <div className={styles.celebrationEmoji}>
                {isPassing ? '🎉' : '💪'}
            </div>

            {/* Result card */}
            <div className={styles.resultsCard}>
                <h1 className={styles.resultsTitle}>
                    {isPassing ? 'Awesome Job!' : 'Keep Practicing!'}
                </h1>

                {/* Score circle */}
                <div
                    className={styles.scoreCircle}
                    style={{
                        background: isPassing
                            ? 'linear-gradient(135deg, #4caf50, #8bc34a)'
                            : 'linear-gradient(135deg, #ff9800, #ffc107)',
                    }}
                >
                    <span className={styles.scorePercentage}>{percentage}%</span>
                    <span className={styles.scoreLabel}>Score</span>
                </div>

                {/* Stats grid */}
                <div className={styles.resultsStats}>
                    <div className={styles.resultStatBox}>
                        <span className={styles.resultStatIcon}>✅</span>
                        <span className={styles.resultStatValue}>{state.correctAnswers}</span>
                        <span className={styles.resultStatLabel}>Correct</span>
                    </div>
                    <div className={styles.resultStatBox}>
                        <span className={styles.resultStatIcon}>❌</span>
                        <span className={styles.resultStatValue}>{state.questions.length - state.correctAnswers}</span>
                        <span className={styles.resultStatLabel}>Wrong</span>
                    </div>
                    <div className={styles.resultStatBox}>
                        <span className={styles.resultStatIcon}>⭐</span>
                        <span className={styles.resultStatValue}>+{xpEarned}</span>
                        <span className={styles.resultStatLabel}>Stars Earned</span>
                    </div>
                </div>

                {/* Mascot message */}
                <div className={styles.mascotMessage}>
                    <span className={styles.resultsMascot}>{currentMascot?.emoji}</span>
                    <span className={styles.mascotSays}>
                        {isPassing
                            ? `Way to go, ${state.playerName || 'Champion'}! You're a star! 🌟`
                            : `Don't give up, ${state.playerName || 'friend'}! Practice makes perfect! 💪`
                        }
                    </span>
                </div>

                {/* Question Review Section */}
                {showReview && (
                    <div className={styles.reviewSection}>
                        <h3 className={styles.reviewTitle}>📝 Question Review</h3>
                        <div className={styles.reviewList}>
                            {state.userAnswers.map((answer, index) => {
                                const question = state.questions[answer.questionIndex];
                                if (!question) return null;

                                return (
                                    <div
                                        key={index}
                                        className={`${styles.reviewItem} ${answer.isCorrect ? styles.reviewItemCorrect : styles.reviewItemWrong}`}
                                    >
                                        <span className={styles.reviewIcon}>
                                            {answer.isCorrect ? '✅' : '❌'}
                                        </span>
                                        <div className={styles.reviewContent}>
                                            <p className={styles.reviewQuestion}>
                                                Q{index + 1}: {question.text.substring(0, 60)}...
                                            </p>
                                            <p className={styles.reviewAnswer}>
                                                Your answer: <strong>{answer.selectedAnswer}</strong>
                                                {!answer.isCorrect && (
                                                    <span className={styles.reviewAnswerCorrect}>
                                                        {' '}(Correct: {question.correctAnswer})
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className={styles.resultsActions}>
                    <button
                        className={styles.retryButton}
                        onClick={onRetry}
                    >
                        <span>🔄</span>
                        <span>Try Again</span>
                    </button>
                    <button
                        style={{
                            padding: '16px 35px',
                            background: showReview ? '#9e9e9e' : 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                            border: 'none',
                            borderRadius: '30px',
                            color: '#fff',
                            fontSize: '18px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 8px 30px rgba(33, 150, 243, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                        onClick={() => setShowReview(!showReview)}
                    >
                        <span>📝</span>
                        <span>{showReview ? 'Hide Review' : 'Review'}</span>
                    </button>
                    <button
                        className={styles.continueButton}
                        onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'landing' })}
                    >
                        <span>🏠</span>
                        <span>Topics</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
