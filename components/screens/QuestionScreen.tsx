import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useAudioFeedback } from '../../hooks/useAudioFeedback';
import styles from '../../styles/QuestionScreen.module.css';
import sharedStyles from '../../styles/shared.module.css';
import KnowMoreModal from '../modals/KnowMoreModal';
import OopsModal from '../modals/OopsModal';

export default function QuestionScreen() {
    const { state, dispatch, currentMascot, currentQuestion, stats } = useQuiz();
    const audio = useAudioFeedback();
    const [showHint, setShowHint] = React.useState(false);
    const [showOopsModal, setShowOopsModal] = React.useState(false);

    // Reset hint visibility on new question
    React.useEffect(() => {
        setShowHint(false);
    }, [state.currentQuestionIndex]);

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

    // Get the question type (default to MCQ if not specified)
    const questionType = currentQuestion?.questionType ||
        (currentQuestion?.answers && currentQuestion.answers.length > 0 ? 'MCQ' : 'TTA');

    // Check if answer is correct - supports multiple answers separated by |
    const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
        if (!userAnswer || !correctAnswer) return false;

        // Check for multiple allowed answers (pipe-separated)
        const allowedAnswers = (currentQuestion?.multipleAnswers || correctAnswer)
            .split('|')
            .map(a => a.trim().toLowerCase());

        return allowedAnswers.includes(userAnswer.trim().toLowerCase());
    };

    const handleSubmit = () => {
        if (!currentQuestion) return;

        // Get the answer based on question type
        const userAnswer = questionType === 'MCQ'
            ? state.selectedAnswer
            : state.typedAnswer;

        if (!userAnswer) return;

        // Check if answer is correct (forced wrong if used Know More before answering)
        let isCorrect: boolean;
        if (questionType === 'MCQ') {
            isCorrect = userAnswer === currentQuestion.correctAnswer;
        } else {
            // For TTA/FIB, check with multiple answer support
            isCorrect = checkAnswer(userAnswer, currentQuestion.correctAnswer);
        }

        // Play audio feedback
        if (isCorrect) {
            audio.playCorrect();
        } else {
            audio.playIncorrect();

            // Prepare text for wrong answer log
            let userAnswerText = userAnswer;
            let correctAnswerText = currentQuestion.correctAnswer;

            if (questionType === 'MCQ') {
                const selectedOption = currentQuestion.answers.find(a => a.id === userAnswer);
                const correctOption = currentQuestion.answers.find(a => a.id === currentQuestion.correctAnswer);
                userAnswerText = selectedOption ? selectedOption.text : userAnswer;
                correctAnswerText = correctOption ? correctOption.text : currentQuestion.correctAnswer;
            }

            // Track wrong answer
            dispatch({
                type: 'ADD_WRONG_ANSWER',
                payload: {
                    questionId: currentQuestion.id,
                    questionText: currentQuestion.text,
                    correctAnswerText: correctAnswerText,
                    userAnswerText: userAnswerText,
                }
            });
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

        // Removed auto-advance. User must click Next.
    };

    const handleNext = () => {
        if (state.currentQuestionIndex < state.questions.length - 1) {
            dispatch({ type: 'NEXT_QUESTION' });
        } else {
            // Quiz completed - update stats
            // Calculate percentage based on correct answers
            // Note: We might want to track current session correct answers accurately
            const percentage = Math.round(((state.correctAnswers) / state.questions.length) * 100);
            if (state.selectedTopic) {
                stats.updateBestScore(state.selectedTopic.id, percentage);
            }
            stats.incrementQuizzes();
            audio.playSuccess();
            dispatch({ type: 'SET_SCREEN', screen: 'results' });
        }
    };

    const handleKnowMore = () => {
        if (!state.questionAnswered) {
            dispatch({ type: 'SET_KNOW_MORE_USED' });
        }
        dispatch({ type: 'TOGGLE_KNOW_MORE_POPUP', show: true });
    };

    const handleSkip = () => {
        if (state.currentQuestionIndex < state.questions.length - 1) {
            dispatch({ type: 'SKIP_QUESTION' });
        } else {
            // Last question - go to results
            audio.playSuccess();
            dispatch({ type: 'SET_SCREEN', screen: 'results' });
        }
    };

    const handlePrevious = () => {
        if (state.currentQuestionIndex > 0) {
            dispatch({ type: 'PREVIOUS_QUESTION' });
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

    // Render answer input based on question type
    const renderAnswerSection = () => {
        if (questionType === 'MCQ') {
            // Multiple Choice - show option buttons
            return (
                <div className={styles.answersPanel}>
                    {currentQuestion.answers.map((answer) => {
                        const isCorrect = answer.id === currentQuestion.correctAnswer;
                        const isSelected = state.selectedAnswer === answer.id;

                        let cardClass = styles.answerCard;
                        if (isSelected) cardClass += ` ${styles.answerSelected}`;

                        // Visual Feedback if answered
                        if (state.questionAnswered) {
                            if (isCorrect) {
                                cardClass += ` ${styles.answerCorrect}`;
                            } else if (isSelected && !isCorrect) {
                                cardClass += ` ${styles.answerWrong}`;
                            }
                        }

                        return (
                            <div
                                key={answer.id}
                                className={cardClass}
                                onClick={() => !state.questionAnswered && dispatch({ type: 'SELECT_ANSWER', answerId: answer.id })}
                                role="radio"
                                aria-checked={isSelected}
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && !state.questionAnswered && dispatch({ type: 'SELECT_ANSWER', answerId: answer.id })}
                            >
                                <span className={`${styles.answerBadge} ${isSelected ? styles.answerBadgeSelected : ''}`}>
                                    {answer.id}
                                </span>
                                <span
                                    className={styles.answerText}
                                    style={{ color: isSelected ? '#fff' : undefined }}
                                >
                                    {answer.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            // TTA (Type the Answer) or FIB (Fill in Blank) - show text input
            return (
                <div className={styles.answersPanel}>
                    {/* Show FIB sentence if available */}
                    {currentQuestion.fib_sentence && (
                        <div className={styles.fibSentence}>
                            <span className={styles.fibLabel}>Complete the sentence:</span>
                            <p className={styles.fibText}>{currentQuestion.fib_sentence}</p>
                        </div>
                    )}

                    <div className={styles.typedAnswerContainer}>
                        <input
                            type="text"
                            className={styles.typedAnswerInput}
                            placeholder={questionType === 'FIB' ? "Type the missing word..." : "Type your answer..."}
                            value={state.typedAnswer}
                            onChange={(e) => dispatch({ type: 'SET_TYPED_ANSWER', answer: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && !state.questionAnswered && handleSubmit()}
                            disabled={state.questionAnswered}
                            autoFocus
                        />
                        {state.questionAnswered && (
                            <div className={styles.answerFeedback}>
                                {checkAnswer(state.typedAnswer, currentQuestion.correctAnswer) ? (
                                    <span className={styles.correctFeedback}>✓ Correct!</span>
                                ) : (
                                    <div className={styles.wrongFeedback}>
                                        <span>✗ Incorrect</span>
                                        <span className={styles.correctAnswerDisplay}>
                                            Correct answer: <strong>{currentQuestion.correctAnswer}</strong>
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    // Check if submit button should be enabled
    const canSubmit = questionType === 'MCQ'
        ? state.selectedAnswer && !state.questionAnswered
        : state.typedAnswer.trim() && !state.questionAnswered;

    // Determine Button Action
    const buttonText = state.questionAnswered ? (state.currentQuestionIndex === state.questions.length - 1 ? 'FINISH' : 'NEXT') : 'SUBMIT';
    const handleButtonClick = state.questionAnswered ? handleNext : handleSubmit;
    const buttonDisabled = !state.questionAnswered && !canSubmit;

    const hasKnowMore = !!(currentQuestion?.knowMore || currentQuestion?.knowMoreText || currentQuestion?.youtubeUrl);

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
                    {/* Skip counter badge */}
                    {state.skippedCount > 0 && (
                        <div className={styles.skipBadge} title="Skipped questions">
                            <span>⏭️</span>
                            <span>{state.skippedCount}</span>
                        </div>
                    )}
                    <button className={styles.navIcon} aria-label="Sound">🔊</button>
                    {/* Settings button removed */}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className={styles.questionNumber}>
                                {state.currentQuestionIndex + 1}/{state.questions.length}
                            </span>
                            {state.currentWorksheetName && (
                                <span style={{
                                    fontSize: '12px',
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    color: '#fff'
                                }}>
                                    📂 {state.currentWorksheetName}
                                </span>
                            )}
                        </div>
                        <span className={styles.questionCategory}>{state.selectedTopic?.name || 'Quiz'}</span>
                        {/* Question Type Badge */}
                        <span className={styles.questionTypeBadge}>
                            {currentQuestion.questionType === 'FIB' ? '✏️ Fill in Blank' :
                                currentQuestion.questionType === 'TTA' ? '⌨️ Type Answer' :
                                    '📝 MCQ'}
                        </span>
                        {/* Zoom button removed */}
                    </div>

                    <div className={styles.questionText}>
                        {currentQuestion.text}
                    </div>

                    {/* Hint Banner - Only visible when showHint is true */}
                    {showHint && currentQuestion.hint && (
                        <div className={styles.hintBanner}>
                            <span style={{ fontSize: '20px' }}>💡</span>
                            <div>
                                <strong>Hint:</strong> {currentQuestion.hint}
                            </div>
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

                {/* Answers Panel - MCQ or Type Input based on question type */}
                {renderAnswerSection()}
            </div>

            {/* Bottom Actions Bar */}
            <div className={styles.bottomActions}>
                {/* Left side - Navigation and Helper buttons */}
                <div className={styles.helperButtons}>
                    {/* Previous Button */}
                    <button
                        className={styles.prevButton}
                        style={{ opacity: state.currentQuestionIndex > 0 ? 1 : 0.5 }}
                        onClick={handlePrevious}
                        disabled={state.currentQuestionIndex === 0}
                    >
                        <span className={styles.prevIcon}>⏮️</span>
                        <span className={styles.helperText}>Previous</span>
                    </button>

                    <button
                        className={styles.hintButton}
                        style={{ opacity: currentQuestion.hint ? 1 : 0.5 }}
                        onClick={() => currentQuestion.hint && setShowHint(!showHint)}
                        disabled={!currentQuestion.hint}
                    >
                        <span className={styles.hintIconSmall}>💡</span>
                        <span className={styles.helperText}>{showHint ? 'Hide Hint' : 'Hint'}</span>
                    </button>
                    <button
                        className={styles.knowMoreButton}
                        style={{ opacity: hasKnowMore ? 1 : 0.5 }}
                        onClick={handleKnowMore}
                        disabled={!hasKnowMore}
                    >
                        <span className={styles.knowMoreIcon}>📖</span>
                        <span className={styles.helperText}>Know More</span>
                    </button>
                    <button
                        className={styles.skipButton}
                        onClick={handleSkip}
                        disabled={state.questionAnswered}
                        style={{ opacity: state.questionAnswered ? 0.5 : 1 }}
                    >
                        <span className={styles.skipIcon}>⏭️</span>
                        <span className={styles.helperText}>Skip</span>
                    </button>

                    {/* Wrong Answers Review Button */}
                    {state.wrongAnswers.length > 0 && (
                        <button
                            className={styles.oopsButton}
                            onClick={() => setShowOopsModal(true)}
                        >
                            <span className={styles.oopsIcon}>😅</span>
                            <span className={styles.helperText}>Oops ({state.wrongAnswers.length})</span>
                        </button>
                    )}
                </div>

                {/* Know More Modal */}
                {state.showKnowMorePopup && (
                    <KnowMoreModal
                        onClose={() => dispatch({ type: 'TOGGLE_KNOW_MORE_POPUP', show: false })}
                        data={{
                            title: 'Know More',
                            text: currentQuestion.knowMoreText,
                            url: currentQuestion.knowMore,
                            imageUrl: currentQuestion.imageUrl,
                            youtubeUrl: currentQuestion.youtubeUrl
                        }}
                    />
                )}

                {/* Oops Modal */}
                {showOopsModal && (
                    <OopsModal
                        wrongAnswers={state.wrongAnswers}
                        onClose={() => setShowOopsModal(false)}
                    />
                )}

                {/* Right side - Submit/Next */}
                <button
                    className={styles.submitButton}
                    style={{ opacity: buttonDisabled ? 0.5 : 1 }}
                    onClick={handleButtonClick}
                    disabled={buttonDisabled}
                >
                    <span>{buttonText}</span>
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
