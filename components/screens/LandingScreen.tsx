import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Topic, TopicConfig } from '../../services/googleSheetsService';
import styles from '../../styles/LandingScreen.module.css';
import sharedStyles from '../../styles/shared.module.css';

interface LandingScreenProps {
    topics: Topic[];
    topicConfigs: TopicConfig[];
    onTopicClick: (topic: Topic) => void;
    onShowSettings: () => void;
}

export default function LandingScreen({
    topics,
    topicConfigs,
    onTopicClick,
    onShowSettings
}: LandingScreenProps) {
    const { state, dispatch, currentMascot, stats } = useQuiz();

    // Calculate total quizzes available
    const totalQuizzes = topics.reduce((sum, t) => sum + t.total, 0);

    // Get best score from stats
    const overallBestScore = Object.values(stats.stats.bestScores).length > 0
        ? Math.max(...Object.values(stats.stats.bestScores))
        : 0;

    return (
        <div className={styles.landingContainer}>
            {/* Particles */}
            <div className={sharedStyles.particlesContainer}>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.particle}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            width: `${4 + Math.random() * 8}px`,
                            height: `${4 + Math.random() * 8}px`,
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <div className={styles.landingHeader}>
                <button
                    className={sharedStyles.backButton}
                    onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'login' })}
                    aria-label="Go back to login"
                >
                    <span className={sharedStyles.backArrow}>←</span>
                </button>
                <h1 className={styles.mainTitle}>Super Quiz!</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className={sharedStyles.profileButton}
                        onClick={onShowSettings}
                        aria-label="Settings"
                    >
                        <span>⚙️</span>
                    </button>
                    <button
                        className={sharedStyles.profileButton}
                        aria-label="Profile"
                    >
                        <span>{currentMascot?.emoji}</span>
                    </button>
                </div>
            </div>

            {/* Stats Banner */}
            <div className={styles.statsBanner}>
                <div className={styles.statsLeft}>
                    <span className={styles.statsIconLanding}>🎯</span>
                    <div className={styles.statsContent}>
                        <span className={styles.statsNumber}>{overallBestScore}%</span>
                        <span className={styles.statsLabel}>Best Score</span>
                    </div>
                </div>
                <div className={styles.statsDivider} />
                <div className={styles.statsRight}>
                    <span className={styles.statsIconLanding}>📋</span>
                    <div className={styles.statsContent}>
                        <span className={styles.statsNumber}>{totalQuizzes}</span>
                        <span className={styles.statsLabel}>Quizzes Available</span>
                    </div>
                </div>
                <div className={styles.streakBadge}>
                    <span>🔥 {stats.stats.streakDays} day streak!</span>
                </div>
            </div>

            {/* Welcome Message */}
            <div className={styles.welcomeMessage}>
                <span>Welcome back, <strong>{state.playerName || 'Student'}</strong>! Ready to learn?</span>
            </div>

            <h2 className={styles.sectionTitle}>Select a topic and start learning</h2>

            {/* Topics Grid */}
            <div className={styles.topicsGrid}>
                {topics.map((topic, index) => {
                    const bestScore = stats.getBestScore(topic.id);
                    return (
                        <div
                            key={topic.id}
                            className={styles.topicCard}
                            style={{
                                borderLeftColor: topic.color,
                                animationDelay: `${index * 0.1}s`,
                            }}
                            onClick={() => onTopicClick(topic)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && onTopicClick(topic)}
                            aria-label={`${topic.name} quiz - ${topic.difficulty} difficulty`}
                        >
                            <div className={styles.topicHeader}>
                                <span className={styles.topicIcon}>{topic.icon}</span>
                                <button className={styles.infoButton} aria-label="Topic info">ⓘ</button>
                            </div>
                            <h3 className={styles.topicName}>{topic.name}</h3>
                            <div
                                className={styles.difficultyBadge}
                                style={{
                                    backgroundColor: topic.color + '20',
                                    color: topic.color,
                                }}
                            >
                                {topic.difficulty}
                            </div>
                            <div className={styles.topicProgress}>
                                <span>Best: {bestScore}%</span>
                                <span>Questions: {topic.total}</span>
                            </div>
                            {bestScore > 0 && (
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{
                                            width: `${bestScore}%`,
                                            backgroundColor: topic.color,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Loading Overlay */}
            {state.isLoadingQuestions && (
                <div className={sharedStyles.loadingOverlay}>
                    <div className={sharedStyles.loadingSpinner}>Loading questions...</div>
                </div>
            )}

            {/* Mascot */}
            <div className={styles.mascotContainer}>
                <span className={styles.mascotFloat}>{currentMascot?.emoji}</span>
                <div className={styles.speechBubble}>Pick a topic, {state.playerName || 'friend'}!</div>
            </div>
        </div>
    );
}
