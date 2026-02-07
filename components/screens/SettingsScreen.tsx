import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { TopicConfig, WorksheetConfig } from '../../services/googleSheetsService';
import { useAppSettings } from '../../hooks/useAppSettings';
import QAEditorModal from '../modals/QAEditorModal';
import styles from '../../styles/SettingsScreen.module.css';

// Theme Selector Component
function ThemeSelector() {
    const { themeIndex, setThemeByIndex } = useTheme();

    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            {THEMES.map((theme, i) => (
                <button
                    key={theme.name}
                    onClick={() => setThemeByIndex(i)}
                    title={theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.buttonGrad1}, ${theme.buttonGrad2})`,
                        border: themeIndex === i ? '3px solid #fff' : '2px solid rgba(255,255,255,0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transform: themeIndex === i ? 'scale(1.15)' : 'scale(1)',
                        boxShadow: themeIndex === i ? `0 0 15px ${theme.accent}` : 'none',
                    }}
                />
            ))}
        </div>
    );
}

interface SettingsScreenProps {
    topicConfigs: TopicConfig[];
    worksheetConfigs?: WorksheetConfig[];
    onGenerateWorksheet: () => void;
}

export default function SettingsScreen({
    topicConfigs,
    worksheetConfigs = [],
    onGenerateWorksheet
}: SettingsScreenProps) {
    const { state, dispatch } = useQuiz();
    const { settings, updateApiKey, updateSheetUrl, toggleAutoLoad, resetToDefaults } = useAppSettings();
    const [showApiKey, setShowApiKey] = useState(false);
    const [showQAEditor, setShowQAEditor] = useState(false);
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

            {/* Tile Configuration Section */}
            {worksheetConfigs.length > 0 && (
                <div className={styles.settingsSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <h2 className={styles.settingsSectionTitle} style={{ marginBottom: '5px' }}>📚 Workbook Tiles</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>
                                Configure tiles and difficulty.
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '5px 10px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ff9800' }}>DIFFICULTY:</span>
                            <select
                                value={state.globalDifficulty}
                                onChange={(e) => dispatch({ type: 'SET_GLOBAL_DIFFICULTY', difficulty: e.target.value as any })}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option value="None" style={{ color: 'black' }}>NONE (ALL)</option>
                                <option value="Easy" style={{ color: 'black' }}>LOW</option>
                                <option value="Medium" style={{ color: 'black' }}>MEDIUM</option>
                                <option value="Hard" style={{ color: 'black' }}>HIGH</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.otherSettingsCard}>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((tileIndex) => {
                            const currentWorksheetId = state.tileSettings[tileIndex] || '';
                            const selectedWorksheet = worksheetConfigs.find(w => w.id === currentWorksheetId);
                            const customName = state.tileNames[tileIndex] || '';

                            return (
                                <div key={tileIndex} className={styles.settingRow} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', marginBottom: '10px' }}>
                                    <div className={styles.settingInfo} style={{ flex: 1, marginRight: '10px' }}>
                                        <span className={styles.settingIcon}>
                                            {selectedWorksheet ? (selectedWorksheet as any).icon || '📝' : '⬛'}
                                        </span>
                                        <input
                                            type="text"
                                            value={customName}
                                            placeholder={`Tile ${tileIndex} ${selectedWorksheet ? `(${selectedWorksheet.name})` : ''}`}
                                            onChange={(e) => dispatch({ type: 'SET_TILE_NAME', tileIndex, name: e.target.value })}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                borderBottom: '1px dashed rgba(255,255,255,0.3)',
                                                color: 'white',
                                                fontSize: '14px',
                                                width: '100%',
                                                padding: '5px 0',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <select
                                        value={currentWorksheetId}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            dispatch({ type: 'SET_TILE_CONFIG', tileIndex, worksheetId: val });
                                        }}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'rgba(0,0,0,0.2)',
                                            color: 'white',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            outline: 'none',
                                            maxWidth: '180px'
                                        }}
                                    >
                                        <option value="" style={{ color: '#888' }}>🚫 Hide Tile</option>
                                        <optgroup label="Available Worksheets" style={{ color: 'black' }}>
                                            {worksheetConfigs.map(ws => (
                                                <option key={ws.id} value={ws.id} style={{ color: 'black' }}>
                                                    {ws.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>
                            );
                        })}
                    </div>
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
                                onClick={async () => {
                                    setSaveMessage('Testing...');
                                    try {
                                        const { validateApiKey } = await import('../../services/geminiService');
                                        const isValid = await validateApiKey(tempApiKey);
                                        setSaveMessage(isValid ? '✅ Valid Key!' : '❌ Invalid Key');
                                    } catch (e) {
                                        setSaveMessage('❌ Error');
                                    }
                                    setTimeout(() => setSaveMessage(''), 3000);
                                }}
                                style={{
                                    padding: '14px 24px',
                                    borderRadius: '12px',
                                    background: 'rgba(33, 150, 243, 0.2)',
                                    border: '1px solid #2196f3',
                                    color: '#2196f3',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    marginLeft: '10px'
                                }}
                            >
                                Test
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
                    {/* Theme Selector */}
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingIcon}>🎨</span>
                            <span className={styles.settingName}>Theme</span>
                        </div>
                        <ThemeSelector />
                    </div>
                    {/* QA Editor Toggle */}
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingIcon}>📝</span>
                            <span className={styles.settingName}>QA Editor</span>
                        </div>
                        <button
                            className={styles.toggleBtn}
                            style={{ background: '#7c4dff', width: 'auto', padding: '8px 20px', borderRadius: '10px' }}
                            onClick={() => setShowQAEditor(true)}
                        >
                            OPEN
                        </button>
                    </div>
                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingIcon}>👶</span>
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
            {showQAEditor && (
                <QAEditorModal
                    onClose={() => setShowQAEditor(false)}
                    currentTopic={null}
                />
            )}

            {/* Version Display */}
            <div style={{
                position: 'fixed',
                bottom: '5px',
                right: '10px',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'monospace',
                pointerEvents: 'none',
                zIndex: 1000
            }}>
                ver.07-02-26 19:00
            </div>
        </div>
    );
}
