import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { generateWorksheet, fetchQuestionsFromSheetUrl, WorksheetConfig, GeneratedQuestion } from '../../services/worksheetGeneratorService';
import { exportToCSV } from '../../utils/csvExporter';
import { useAppSettings } from '../../hooks/useAppSettings';
import styles from '../../styles/SettingsScreen.module.css';

type GenerationMode = 'ai' | 'sheet';

export default function WorksheetGeneratorScreen() {
    const { dispatch } = useQuiz();
    const { settings } = useAppSettings();

    const [mode, setMode] = useState<GenerationMode>('ai');
    const [config, setConfig] = useState<WorksheetConfig>({
        subject: 'math',
        gradeLevel: 3,
        topic: '',
        subtopics: '',
        numberOfQuestions: 10,
        difficulty: 'medium',
    });
    const [sheetUrl, setSheetUrl] = useState(settings.worksheetSheetUrl || '');
    const [exportType, setExportType] = useState<'csv' | 'sheet'>('csv');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
    const [error, setError] = useState('');

    const handleGenerateAI = async () => {
        if (!config.topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            const questions = await generateWorksheet(config);
            setGeneratedQuestions(questions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate questions');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLoadFromSheet = async () => {
        if (!sheetUrl.trim()) {
            setError('Please enter a Google Sheet URL');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            const questions = await fetchQuestionsFromSheetUrl(sheetUrl);
            if (questions.length === 0) {
                throw new Error('No questions found in the sheet');
            }
            setGeneratedQuestions(questions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load questions from sheet');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExport = () => {
        if (generatedQuestions.length === 0) return;

        if (exportType === 'csv') {
            exportToCSV(generatedQuestions, `worksheet_${config.topic.replace(/\s+/g, '_') || 'questions'}.csv`);
        } else {
            alert('Google Sheets export requires API setup. Use CSV export for now.');
        }
    };

    const resetForm = () => {
        setGeneratedQuestions([]);
        setConfig({ ...config, topic: '', subtopics: '' });
        setError('');
    };

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settingsHeader}>
                <button
                    className={styles.settingsBackBtn}
                    onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'settings' })}
                >
                    <span>←</span>
                    <span>Back</span>
                </button>
                <h1 className={styles.settingsTitle}>🤖 Worksheet Generator</h1>
                <div style={{ width: 80 }} />
            </div>

            {/* Mode Toggle */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '25px',
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '30px',
                    padding: '5px',
                    display: 'flex',
                    position: 'relative'
                }}>
                    <button
                        onClick={() => { setMode('sheet'); resetForm(); }}
                        style={{
                            padding: '10px 25px',
                            borderRadius: '25px',
                            background: mode === 'sheet' ? '#4caf50' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            zIndex: 1
                        }}
                    >
                        📊 Google Sheet
                    </button>
                    <button
                        onClick={() => { setMode('ai'); resetForm(); }}
                        style={{
                            padding: '10px 25px',
                            borderRadius: '25px',
                            background: mode === 'ai' ? '#7c4dff' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            zIndex: 1
                        }}
                    >
                        🤖 AI Generator
                    </button>
                </div>
            </div>

            <div className={styles.generatorCard}>
                {/* AI Generation Mode */}
                {mode === 'ai' && (
                    <div className={styles.generatorForm}>
                        <h3 style={{ color: '#fff', marginBottom: '20px' }}>
                            ✨ AI Question Generator
                        </h3>

                        {/* Subject Selection */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>📚 Subject</label>
                                <select
                                    className={styles.formSelect}
                                    value={config.subject}
                                    onChange={(e) => setConfig({ ...config, subject: e.target.value as 'math' | 'english' })}
                                >
                                    <option value="math">Math</option>
                                    <option value="english">English</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>🎓 Grade Level</label>
                                <select
                                    className={styles.formSelect}
                                    value={config.gradeLevel}
                                    onChange={(e) => setConfig({ ...config, gradeLevel: parseInt(e.target.value) })}
                                >
                                    <option value={1}>Grade 1</option>
                                    <option value={2}>Grade 2</option>
                                    <option value={3}>Grade 3</option>
                                    <option value={4}>Grade 4</option>
                                    <option value={5}>Grade 5</option>
                                </select>
                            </div>
                        </div>

                        {/* Topic Input */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>📝 Topic</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                placeholder={config.subject === 'math' ? 'e.g., Multiplication Tables' : 'e.g., Vocabulary - Animals'}
                                value={config.topic}
                                onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                            />
                        </div>

                        {/* Subtopics */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>📋 Subtopics (comma-separated)</label>
                            <textarea
                                className={styles.formTextarea}
                                placeholder={config.subject === 'math'
                                    ? 'e.g., 2x tables, 5x tables, 10x tables'
                                    : 'e.g., farm animals, wild animals, sea creatures'}
                                value={config.subtopics}
                                onChange={(e) => setConfig({ ...config, subtopics: e.target.value })}
                            />
                        </div>

                        {/* Number of Questions & Difficulty */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>🔢 Questions</label>
                                <select
                                    className={styles.formSelect}
                                    value={config.numberOfQuestions}
                                    onChange={(e) => setConfig({ ...config, numberOfQuestions: parseInt(e.target.value) })}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>⭐ Difficulty</label>
                                <select
                                    className={styles.formSelect}
                                    value={config.difficulty}
                                    onChange={(e) => setConfig({ ...config, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sheet Import Mode */}
                {mode === 'sheet' && (
                    <div className={styles.generatorForm}>
                        <h3 style={{ color: '#fff', marginBottom: '20px' }}>
                            📊 Import from Google Sheet
                        </h3>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>🔗 Google Sheet URL</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                            />
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '8px' }}>
                                The sheet must be published or shared publicly. Questions should follow the standard format.
                            </p>
                        </div>

                        <div style={{
                            padding: '20px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            marginTop: '15px',
                        }}>
                            <p style={{ color: '#fff', fontWeight: 700, marginBottom: '10px' }}>
                                📄 Expected Sheet Format:
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.6 }}>
                                Question | Option 1 | Option 2 | Option 3 | Option 4 | Answer | Hint | ...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '15px',
                        background: 'rgba(244, 67, 54, 0.2)',
                        borderRadius: '12px',
                        color: '#f44336',
                        fontWeight: 600,
                        marginTop: '15px',
                    }}>
                        ❌ {error}
                    </div>
                )}

                {/* Generate/Load Button */}
                {!isGenerating && generatedQuestions.length === 0 && (
                    <button
                        className={styles.generateBtn}
                        onClick={mode === 'ai' ? handleGenerateAI : handleLoadFromSheet}
                        disabled={mode === 'ai' ? !config.topic.trim() : !sheetUrl.trim()}
                        style={{ marginTop: '20px' }}
                    >
                        <span>{mode === 'ai' ? '✨' : '📥'}</span>
                        <span>{mode === 'ai' ? 'Generate Questions' : 'Load Questions'}</span>
                    </button>
                )}

                {/* Loading State */}
                {isGenerating && (
                    <div className={styles.generatorProgress}>
                        <div className={styles.progressSpinner} />
                        <span className={styles.progressText}>
                            {mode === 'ai' ? `Generating ${config.numberOfQuestions} questions...` : 'Loading questions from sheet...'}
                        </span>
                    </div>
                )}

                {/* Preview Generated Questions */}
                {generatedQuestions.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <h3 style={{ color: '#fff', marginBottom: '15px' }}>
                            ✅ Loaded {generatedQuestions.length} Questions
                        </h3>

                        {/* Export Options */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>📤 Save Questions</label>
                            <div className={styles.exportOptions}>
                                <div
                                    className={`${styles.exportOption} ${exportType === 'csv' ? styles.exportOptionActive : ''}`}
                                    onClick={() => setExportType('csv')}
                                >
                                    <span className={styles.exportOptionIcon}>📄</span>
                                    <span className={styles.exportOptionLabel}>Local File (public.csv)</span>
                                </div>
                                <div
                                    className={`${styles.exportOption} ${exportType === 'sheet' ? styles.exportOptionActive : ''}`}
                                    onClick={() => setExportType('sheet')}
                                >
                                    <span className={styles.exportOptionIcon}>📊</span>
                                    <span className={styles.exportOptionLabel}>Google Sheet</span>
                                </div>
                            </div>
                        </div>

                        {/* Question Preview */}
                        <div style={{
                            maxHeight: '250px',
                            overflowY: 'auto',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            padding: '15px',
                            marginTop: '15px',
                        }}>
                            {generatedQuestions.slice(0, 5).map((q, i) => (
                                <div key={i} style={{
                                    padding: '12px',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    marginBottom: '10px'
                                }}>
                                    <p style={{ color: '#fff', fontWeight: 700, margin: '0 0 8px 0' }}>
                                        Q{i + 1}: {q.question}
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {(['A', 'B', 'C', 'D'] as const).map((letter) => (
                                            <span
                                                key={letter}
                                                style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '8px',
                                                    background: q.correctAnswer === letter ? '#4caf50' : 'rgba(255,255,255,0.1)',
                                                    color: '#fff',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {letter}: {q[`option${letter}` as keyof GeneratedQuestion]}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {generatedQuestions.length > 5 && (
                                <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                                    ... and {generatedQuestions.length - 5} more questions
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button
                                className={styles.generateBtn}
                                onClick={handleExport}
                                style={{ flex: 1 }}
                            >
                                <span>💾</span>
                                <span>{exportType === 'csv' ? 'Save to Public File' : 'Export to Sheet'}</span>
                            </button>
                            <button
                                className={styles.settingsBackBtn}
                                onClick={resetForm}
                                style={{ flex: 1 }}
                            >
                                <span>🔄</span>
                                <span>Start Over</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
