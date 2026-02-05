import React, { useRef, useState } from 'react';
import { useQuiz, MASCOTS } from '../../context/QuizContext';
import { LeaderboardEntry } from '../../services/googleSheetsService';
import styles from '../../styles/LoginScreen.module.css';

interface LoginScreenProps {
    leaderboard: LeaderboardEntry[];
    onShowSettings: () => void;
}

export default function LoginScreen({ leaderboard, onShowSettings }: LoginScreenProps) {
    const { state, dispatch, currentMascot } = useQuiz();
    const [hoveredMascot, setHoveredMascot] = useState<string | null>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const handleStartAdventure = () => {
        if (state.playerName.trim()) {
            // Save to localStorage
            localStorage.setItem('player-name', state.playerName);
            localStorage.setItem('selected-mascot', state.selectedMascot);
            dispatch({ type: 'SET_SCREEN', screen: 'landing' });
        }
    };

    return (
        <div className={styles.loginContainer}>
            {/* Animated space background */}
            <div className={styles.spaceBackground}>
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.star}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            width: `${2 + Math.random() * 3}px`,
                            height: `${2 + Math.random() * 3}px`,
                        }}
                    />
                ))}
                {/* Floating emojis */}
                {['⭐', '🌟', '✨', '🎯', '📚', '🏆', '💫', '🎨'].map((emoji, i) => (
                    <div
                        key={`emoji-${i}`}
                        className={styles.floatingEmoji}
                        style={{
                            left: `${10 + i * 12}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animationDelay: `${i * 0.5}s`,
                        }}
                    >
                        {emoji}
                    </div>
                ))}
            </div>

            {/* Glowing orbs */}
            <div className={styles.glowOrb1} />
            <div className={styles.glowOrb2} />
            <div className={styles.glowOrb3} />

            {/* Main content */}
            <div className={styles.loginContent}>
                {/* Logo section */}
                <div className={styles.logoSection}>
                    <div className={styles.logoIcon}>🎮</div>
                    <h1 className={styles.logoTitle}>Super Quiz!</h1>
                    <p className={styles.logoTagline}>Learn. Play. Conquer.</p>
                </div>

                {/* Glass card */}
                <div className={styles.glassCard}>
                    {/* Mascot showcase */}
                    <div className={styles.mascotShowcase}>
                        <div className={styles.mascotSpotlight}>
                            <div className={styles.spotlightRing} />
                            <div className={styles.spotlightRing2} />
                            <span className={styles.bigMascot}>{currentMascot?.emoji}</span>
                        </div>
                        <div className={styles.mascotInfo}>
                            <span className={styles.mascotLabel}>Your Buddy</span>
                            <span className={styles.mascotNameBig}>{currentMascot?.name}</span>
                        </div>
                    </div>

                    {/* Name input */}
                    <div className={styles.inputGroup}>
                        <label className={styles.modernLabel} htmlFor="playerName">
                            <span className={styles.labelIcon}>👤</span>
                            What's your name, champion?
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="playerName"
                                ref={nameInputRef}
                                type="text"
                                placeholder="Enter your name..."
                                value={state.playerName}
                                onChange={(e) => dispatch({ type: 'SET_PLAYER_NAME', name: e.target.value })}
                                className={styles.modernInput}
                                autoComplete="off"
                                aria-label="Player name"
                            />
                            <div className={styles.inputGlow} />
                        </div>
                    </div>

                    {/* Mascot selection */}
                    <div className={styles.mascotSelection}>
                        <label className={styles.modernLabel}>
                            <span className={styles.labelIcon}>🎭</span>
                            Choose your buddy
                        </label>
                        <div className={styles.mascotCarousel} role="radiogroup" aria-label="Select mascot">
                            {MASCOTS.map((mascot) => (
                                <div
                                    key={mascot.id}
                                    className={`${styles.mascotCard} ${state.selectedMascot === mascot.id ? styles.mascotCardSelected : ''}`}
                                    style={{
                                        ...(state.selectedMascot === mascot.id ? {
                                            background: mascot.bgGradient,
                                            borderColor: mascot.color,
                                            boxShadow: `0 8px 32px ${mascot.color}40`,
                                        } : {}),
                                        ...(hoveredMascot === mascot.id && state.selectedMascot !== mascot.id ? {
                                            transform: 'translateY(-8px) scale(1.05)',
                                            borderColor: mascot.color + '80',
                                        } : {}),
                                    }}
                                    onClick={() => dispatch({ type: 'SET_MASCOT', mascotId: mascot.id })}
                                    onMouseEnter={() => setHoveredMascot(mascot.id)}
                                    onMouseLeave={() => setHoveredMascot(null)}
                                    role="radio"
                                    aria-checked={state.selectedMascot === mascot.id}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            dispatch({ type: 'SET_MASCOT', mascotId: mascot.id });
                                        }
                                    }}
                                >
                                    <span className={styles.mascotCardEmoji}>{mascot.emoji}</span>
                                    <span
                                        className={styles.mascotCardName}
                                        style={{ color: state.selectedMascot === mascot.id ? mascot.color : '#64748b' }}
                                    >
                                        {mascot.name}
                                    </span>
                                    {state.selectedMascot === mascot.id && (
                                        <div className={styles.selectedCheck} style={{ backgroundColor: mascot.color }}>
                                            ✓
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Settings button */}
                    <div className={styles.settingsSection}>
                        <div
                            className={styles.settingChip}
                            onClick={onShowSettings}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onShowSettings();
                                }
                            }}
                        >
                            <span>⚙️</span>
                            <span>Settings</span>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    {leaderboard.length > 0 && (
                        <div className={styles.leaderboardCard}>
                            <div className={styles.leaderboardHeader}>
                                <span className={styles.leaderboardIcon}>👑</span>
                                <span className={styles.leaderboardPlayerName}>{leaderboard[0].name}</span>
                            </div>
                            <div className={styles.leaderboardStatsRow}>
                                <div className={styles.leaderboardStatBox}>
                                    <span className={styles.leaderboardStatIcon}>🏆</span>
                                    <span className={styles.leaderboardStatValue}>{leaderboard[0].quizzes}</span>
                                    <span className={styles.leaderboardStatLabel}>QUIZZES</span>
                                </div>
                                <div className={styles.leaderboardDivider} />
                                <div className={styles.leaderboardStatBox}>
                                    <span className={styles.leaderboardStatIcon}>⭐</span>
                                    <span className={styles.leaderboardStatValue}>{leaderboard[0].stars}</span>
                                    <span className={styles.leaderboardStatLabel}>STARS</span>
                                </div>
                                <div className={styles.leaderboardDivider} />
                                <div className={styles.leaderboardStatBox}>
                                    <span className={styles.leaderboardStatIcon}>🔥</span>
                                    <span className={styles.leaderboardStatValue}>{leaderboard[0].streaks}</span>
                                    <span className={styles.leaderboardStatLabel}>STREAK</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Start button */}
                <button
                    className={styles.startButton}
                    style={{
                        opacity: state.playerName.trim() ? 1 : 0.6,
                        transform: state.playerName.trim() ? 'scale(1)' : 'scale(0.95)',
                    }}
                    onClick={handleStartAdventure}
                    disabled={!state.playerName.trim()}
                    aria-disabled={!state.playerName.trim()}
                >
                    <div className={styles.buttonShine} />
                    <span className={styles.buttonIcon}>🚀</span>
                    <span className={styles.buttonText}>Start Adventure</span>
                    <span className={styles.buttonArrow}>→</span>
                </button>
            </div>
        </div>
    );
}
