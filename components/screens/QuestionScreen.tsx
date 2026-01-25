import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useAudioFeedback } from '../../hooks/useAudioFeedback';
import styles from '../../styles/QuestionScreen.module.css';
import sharedStyles from '../../styles/shared.module.css';

export default function QuestionScreen() {
    const { state, dispatch, currentMascot, currentQuestion, stats } = useQuiz();
    const audio = useAudioFeedback();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progressSegments = Array.from({ length: state.questions.length || 10 }, (_, i) => {
        if (i < state.currentQuestionIndex) return { status: 'correct' };
        if (i === state.currentQuestionIndex) return { status: 'current' };
        return { status: 'pending' };
    });

    const handleSubmit = () => {
        if (!state.selectedAnswer || !currentQuestion) return;

        // Check if answer is correct (forced wrong if used Know More before answering)
        const isCorrect = state.usedKnowMoreBeforeAnswer
            ? false
            : state.selectedAnswer === currentQuestion.correctAnswer;

        // Play audio feedback
        if (isCorrect) {
            audio.playCorrect();
        } else {
            audio.playIncorrect();
        }

        // Submit answer
        dispatch({
            type: 'SUBMIT_ANSWER',
            isCorrect,
            xpEarned: isCorrect ? 5 : 0
        });

        // Update stats
        if (isCorrect) {
            stats.addXp(5);
        }

        // Show Know More popup if available
        if (currentQuestion.knowMoreText) {
            dispatch({ type: 'TOGGLE_KNOW_MORE_POPUP', show: true });
            setTimeout(() => dispatch({ type: 'TOGGLE_KNOW_MORE_POPUP', show: false }), 5000);
        }

        // Move to next question or results after delay
        setTimeout(() => {
            if (state.currentQuestionIndex < state.questions.length - 1) {
                dispatch({ type: 'NEXT_QUESTION' });
            } else {
                // Quiz completed - update stats
                const percentage = Math.round(((state.correctAnswers + (isCorrect ? 1 : 0)) / state.questions.length) * 100);
                if (state.selectedTopic) {
                    stats.updateBestScore(state.selectedTopic.id, percentage);
                }
                stats.incrementQuizzes();
                audio.playSuccess();
                dispatch({ type: 'SET_SCREEN', screen: 'results' });
            }
        }, currentQuestion.knowMoreText ? 2000 : 500);
    };

    const handleKnowMore = () => {
        if (currentQuestion?.knowMore) {
            if (!state.questionAnswered) {
                dispatch({ type: 'SET_KNOW_MORE_USED' });
            }
            window.open(currentQuestion.knowMore, '_blank');
        }
    };

    if (!currentQuestion) {
        return (
            <div className={styles.questionContainer}>
                <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>
                    No questions available. Please go back and try again.
                </div>
            </div>
        );
    }

    return (
        <div className={styles.questionContainer}>
            {/* Animated stars background */}
            <div className={sharedStyles.particlesContainer}>
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className={sharedStyles.starParticle}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            opacity: 0.3 + Math.random() * 0.5,
                        }}
                    />
                ))}
            </div>

            {/* Top Navigation Bar */}
            <div className={styles.topNav}>
                <div
                    className={styles.topicBadge}
                    style={{
                        background: state.selectedTopic
                            ? `linear-gradient(135deg, ${state.selectedTopic.color} 0%, ${state.selectedTopic.color}cc 100%)`
                            : undefined,
                    }}
                >
                    <span className={styles.badgeIcon}>{state.selectedTopic?.icon || '🚀'}</span>
                    <span>{state.selectedTopic?.name?.toUpperCase() || 'QUIZ'}</span>
                </div>

                {/* Progress Bar */}
                <div className={styles.progressSegments}>
                    {progressSegments.map((seg, i) => (
                        <div
                            key={i}
                            className={styles.segment}
                            style={{
                                backgroundColor:
                                    seg.status === 'correct' ? '#4caf50' :
                                        seg.status === 'wrong' ? '#ef5350' :
                                            seg.status === 'current' ? '#ffd700' : '#3a3a6e',
                                boxShadow: seg.status === 'current' ? '0 0 10px #ffd700' : 'none',
                            }}
                        />
                    ))}
                </div>

                <div className={styles.navRight}>
                    <div className={styles.xpBadge}>
                        <span>⭐</span>
                        <span>{stats.stats.xp}</span>
                    </div>
                    <div className={styles.timerBadge}>
                        <span>❤️</span>
                        <span>{formatTime(state.timeLeft)}</span>
                    </div>
                    <button className={styles.navIcon} aria-label="Sound">🔊</button>
                    <button className={styles.navIcon} aria-label="Settings">⚙️</button>
                    <button
                        className={`${styles.navIcon} ${styles.closeButton}`}
                        onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'landing' })}
                        aria-label="Close quiz"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={styles.questionContent}>
                {/* Question Panel */}
                <div className={styles.questionPanel}>
                    <div className={styles.questionHeader}>
                        <span className={styles.questionNumber}>
                            {state.currentQuestionIndex + 1}/{state.questions.length}
                        </span>
                        <span className={styles.questionCategory}>{state.selectedTopic?.name || 'Quiz'}</span>
                        <button className={styles.zoomButton}>🔍 Zoom</button>
                    </div>

                    <div className={styles.questionText}>
                        {currentQuestion.text}
                    </div>

                    {currentQuestion.hint && (
                        <div className={styles.questionNote}>
                            <strong>💡 Hint:</strong> <em>{currentQuestion.hint}</em>
                        </div>
                    )}

                    <div className={styles.questionImage}>
                        {currentQuestion.imageUrl ? (
                            <img
                                src={currentQuestion.imageUrl}
                                alt="Question illustration"
                                className={styles.questionImg}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <span className={styles.rocketImage}>{state.selectedTopic?.icon || '🚀'}</span>
                                <span className={styles.starsDecor}>✨ 🌟 ⭐</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Answers Panel */}
                <div className={styles.answersPanel}>
                    {currentQuestion.answers.map((answer) => (
                        <div
                            key={answer.id}
                            className={`${styles.answerCard} ${state.selectedAnswer === answer.id ? styles.answerSelected : ''}`}
                            onClick={() => !state.questionAnswered && dispatch({ type: 'SELECT_ANSWER', answerId: answer.id })}
                            role="radio"
                            aria-checked={state.selectedAnswer === answer.id}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    if (!state.questionAnswered) {
                                        dispatch({ type: 'SELECT_ANSWER', answerId: answer.id });
                                    }
                                }
                            }}
                        >
                            <span className={`${styles.answerBadge} ${state.selectedAnswer === answer.id ? styles.answerBadgeSelected : ''}`}>
                                {answer.id}
                            </span>
                            <span
                                className={styles.answerText}
                                style={{ color: state.selectedAnswer === answer.id ? '#fff' : undefined }}
                            >
                                {answer.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className={styles.bottomActions}>
                {/* Left side - Helper buttons */}
                <div className={styles.helperButtons}>
                    <button
                        className={styles.hintButton}
                        style={{ opacity: currentQuestion.hint ? 1 : 0.5 }}
                        onClick={() => currentQuestion.hint && alert(`💡 Hint: ${currentQuestion.hint}`)}
                        disabled={!currentQuestion.hint}
                    >
                        <span className={styles.hintIconSmall}>💡</span>
                        <span className={styles.helperText}>Hint</span>
                    </button>
                    <button
                        className={styles.knowMoreButton}
                        style={{ opacity: currentQuestion.knowMore ? 1 : 0.5 }}
                        onClick={handleKnowMore}
                        disabled={!currentQuestion.knowMore}
                    >
                        <span className={styles.knowMoreIcon}>📖</span>
                        <span className={styles.helperText}>Know More</span>
                    </button>
                    <button className={styles.skipButton}>
                        <span className={styles.skipIcon}>⏭️</span>
                        <span className={styles.helperText}>Skip</span>
                    </button>
                </div>

                {/* Know More Popup */}
                {state.showKnowMorePopup && currentQuestion.knowMoreText && (
                    <div className={styles.knowMorePopup}>
                        <div className={styles.knowMorePopupContent}>
                            <span className={styles.knowMorePopupIcon}>📚</span>
                            <span className={styles.knowMorePopupText}>{currentQuestion.knowMoreText}</span>
                        </div>
                    </div>
                )}

                {/* Right side - Submit */}
                <button
                    className={styles.submitButton}
                    style={{ opacity: state.selectedAnswer && !state.questionAnswered ? 1 : 0.5 }}
                    onClick={handleSubmit}
                    disabled={!state.selectedAnswer || state.questionAnswered}
                >
                    <span>SUBMIT</span>
                    <span className={styles.submitArrow}>→</span>
                </button>
            </div>

            {/* Player badge */}
            <div className={styles.playerMini}>
                <span>{currentMascot?.emoji}</span>
                <span>{state.playerName || 'Student'}</span>
            </div>
        </div>
    );
}
