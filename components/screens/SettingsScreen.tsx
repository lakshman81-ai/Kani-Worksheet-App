import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { TopicConfig } from '../../services/googleSheetsService';
import { useAppSettings } from '../../hooks/useAppSettings';
import styles from '../../styles/SettingsScreen.module.css';

interface SettingsScreenProps {
    topicConfigs: TopicConfig[];
    onGenerateWorksheet: () => void;
}

export default function SettingsScreen({
    topicConfigs,
    onGenerateWorksheet
}: SettingsScreenProps) {
    const { state, dispatch } = useQuiz();
    const { settings, updateApiKey, updateSheetUrl, toggleAutoLoad, resetToDefaults } = useAppSettings();
    const [showApiKey, setShowApiKey] = useState(false);
    const [tempApiKey, setTempApiKey] = useState(settings.geminiApiKey);
    const [tempSheetUrl, setTempSheetUrl] = useState(settings.worksheetSheetUrl);
    const [saveMessage, setSaveMessage] = useState('');

    const handleSaveApiKey = () => {
        updateApiKey(tempApiKey);
        setSaveMessage('API Key saved!');
        setTimeout(() => setSaveMessage(''), 2000);
    };

    const handleSaveSheetUrl = () => {
        updateSheetUrl(tempSheetUrl);
        setSaveMessage('Sheet URL saved!');
        setTimeout(() => setSaveMessage(''), 2000);
    };

    const maskApiKey = (key: string) => {
        if (!key) return '';
        if (key.length <= 8) return '••••••••';
        return key.substring(0, 4) + '••••••••••••••••••••' + key.substring(key.length - 4);
    };

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settingsHeader}>
                <button
                    className={styles.settingsBackBtn}
                    onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'landing' })}
                >
                    <span>←</span>
                    <span>Back</span>
                </button>
                <h1 className={styles.settingsTitle}>⚙️ Settings</h1>
                <div style={{ width: 80 }} />
            </div>

            {/* Success Message */}
            {saveMessage && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '15px 25px',
                    background: 'linear-gradient(135deg, #4caf50, #8bc34a)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontWeight: 700,
                    zIndex: 1000,
                    animation: 'slideUp 0.3s ease',
                }}>
                    ✅ {saveMessage}
                </div>
            )}

            {/* API Configuration Section */}
            <div className={styles.settingsSection}>
                <h2 className={styles.settingsSectionTitle}>🔑 API Configuration</h2>
                <div className={styles.otherSettingsCard}>
                    {/* Gemini API Key */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#fff', fontWeight: 700, marginBottom: '10px' }}>
                            Gemini API Key
                        </label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type={showApiKey ? 'text' : 'password'}
                                value={showApiKey ? tempApiKey : maskApiKey(tempApiKey)}
                                onChange={(e) => setTempApiKey(e.target.value)}
                                placeholder="Enter your Gemini API key"
                                style={{
                                    flex: 1,
                                    padding: '14px 18px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: '#fff',
                                    fontFamily: 'monospace',
                                }}
                            />
                            <button
                                onClick={() => setShowApiKey(!showApiKey)}
                                style={{
                                    padding: '14px 20px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                }}
                            >
                                {showApiKey ? '🙈' : '👁️'}
                            </button>
                            <button
                                onClick={handleSaveApiKey}
                                style={{
                                    padding: '14px 24px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Save
                            </button>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '8px' }}>
                            Used for AI worksheet generation. Get your key from Google AI Studio.
                        </p>
                    </div>

                    {/* Worksheet Sheet URL */}
                    <div>
                        <label style={{ display: 'block', color: '#fff', fontWeight: 700, marginBottom: '10px' }}>
                            Worksheet Google Sheet URL
                        </label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={tempSheetUrl}
                                onChange={(e) => setTempSheetUrl(e.target.value)}
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                style={{
                                    flex: 1,
                                    padding: '14px 18px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: '#fff',
                                }}
                            />
                            <button
                                onClick={handleSaveSheetUrl}
                                style={{
                                    padding: '14px 24px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Save
                            </button>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '8px' }}>
                            Link to a Google Sheet with questions. Used for direct import in worksheet generator.
                        </p>
                    </div>
                </div>
            </div>

            {/* Topic Configuration */}
            <div className={styles.settingsSection}>
                <h2 className={styles.settingsSectionTitle}>📋 Topic Configuration</h2>
                <div className={styles.topicConfigList}>
                    {topicConfigs.map((config, i) => (
                        <div key={i} className={styles.topicConfigCard}>
                            <div className={styles.topicConfigHeader}>
                                <span className={styles.topicConfigName}>{config.topic}</span>
                                <span
                                    className={styles.difficultyTag}
                                    style={{
                                        background: config.difficulty === 'Easy' ? '#4caf50'
                                            : config.difficulty === 'Medium' ? '#ff9800'
                                                : '#f44336'
                                    }}
                                >
                                    {config.difficulty}
                                </span>
                            </div>
                            <div className={styles.topicConfigDetails}>
                                <div className={styles.configRow}>
                                    <span className={styles.configLabel}>📄 Sheet:</span>
                                    <span className={styles.configValueUrl}>{config.link}</span>
                                </div>
                                <div className={styles.configRow}>
                                    <span className={styles.configLabel}>📑 Worksheet:</span>
                                    <span className={styles.configValue}>{config.worksheetNo}</span>
                                </div>
                                <div className={styles.configRow}>
                                    <span className={styles.configLabel}>🏷️ Tab:</span>
                                    <span className={styles.configValue}>{config.tabName}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Other Settings */}
            <div className={styles.settingsSection}>
                <h2 className={styles.settingsSectionTitle}>🎮 Other Settings</h2>
                <div className={styles.otherSettingsCard}>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingIcon}>🎨</span>
                            <span className={styles.settingName}>Kid Mode</span>
                        </div>
                        <button
                            className={styles.toggleBtn}
                            style={{
                                background: state.interfaceStyle === 'kid'
                                    ? 'linear-gradient(135deg, #4caf50, #8bc34a)'
                                    : '#333',
                            }}
                            onClick={() => dispatch({
                                type: 'SET_INTERFACE_STYLE',
                                style: state.interfaceStyle === 'kid' ? 'minimal' : 'kid'
                            })}
                        >
                            {state.interfaceStyle === 'kid' ? 'ON' : 'OFF'}
                        </button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingIcon}>🔀</span>
                            <span className={styles.settingName}>Shuffle Questions</span>
                        </div>
                        <button
                            className={styles.toggleBtn}
                            style={{
                                background: state.randomize
                                    ? 'linear-gradient(135deg, #4caf50, #8bc34a)'
                                    : '#333',
                            }}
                            onClick={() => dispatch({ type: 'SET_RANDOMIZE', value: !state.randomize })}
                        >
                            {state.randomize ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Worksheet Generator */}
            <div className={styles.settingsSection}>
                <div className={styles.generatorCard}>
                    <h2 className={styles.generatorTitle}>
                        <span>🤖</span>
                        <span>AI Worksheet Generator</span>
                    </h2>
                    <p className={styles.generatorSubtitle}>
                        Generate quiz questions for Grade 3 English & Math using AI, or import from Google Sheet
                    </p>
                    <button
                        className={styles.generateBtn}
                        onClick={onGenerateWorksheet}
                    >
                        <span>✨</span>
                        <span>Open Generator</span>
                    </button>
                </div>
            </div>

            {/* Reset Button */}
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => {
                        resetToDefaults();
                        setTempApiKey(settings.geminiApiKey);
                        setTempSheetUrl('');
                        setSaveMessage('Settings reset to defaults');
                        setTimeout(() => setSaveMessage(''), 2000);
                    }}
                    style={{
                        padding: '12px 30px',
                        borderRadius: '25px',
                        background: 'rgba(244, 67, 54, 0.2)',
                        border: '2px solid rgba(244, 67, 54, 0.5)',
                        color: '#f44336',
                        fontWeight: 700,
                        cursor: 'pointer',
                    }}
                >
                    🔄 Reset to Defaults
                </button>
            </div>
        </div>
    );
}
