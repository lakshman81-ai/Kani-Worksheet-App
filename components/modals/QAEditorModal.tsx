import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { parseQAText, questionsToText } from '../../services/qaParserService';
import { fetchQuestionsFromSheet } from '../../services/googleSheetsService';
import { Topic } from '../../types';
import { useToast } from '../../context/ToastContext';
import styles from '../../styles/QAEditorModal.module.css'; // We'll create this CSS

interface QAEditorModalProps {
    onClose: () => void;
    currentTopic?: Topic | null;
}

export default function QAEditorModal({ onClose, currentTopic }: QAEditorModalProps) {
    const { state, dispatch } = useQuiz();
    const { showToast } = useToast();

    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [editorContent, setEditorContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initial load of content if questions exist
    useEffect(() => {
        if (state.questions.length > 0) {
            setEditorContent(questionsToText(state.questions));
        }
    }, [state.questions]);

    const handleLogin = () => {
        if (password === 'superdad') {
            setIsAuthenticated(true);
            showToast('Editor unlocked!', { type: 'success' });
        } else {
            showToast('Incorrect password', { type: 'error' });
        }
    };

    const handleSave = () => {
        try {
            const parsedQuestions = parseQAText(editorContent, currentTopic?.id || 'custom');
            if (parsedQuestions.length === 0) {
                showToast('No valid questions found!', { type: 'warning' });
                return;
            }

            dispatch({ type: 'SET_QUESTIONS', questions: parsedQuestions });

            // Save to localStorage for persistence if standard topic? 
            // For now, it updates current quiz state. 
            // Ideally we might want to flag these as "custom" questions.

            showToast(`Loaded ${parsedQuestions.length} questions!`, { type: 'success' });
            onClose();
        } catch (error) {
            console.error(error);
            showToast('Failed to parse questions', { type: 'error' });
        }
    };

    const handleFetchFromSheet = async () => {
        if (!currentTopic?.sheetUrl && !state.selectedTopic?.sheetUrl) {
            showToast('No sheet URL configured for this topic', { type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const targetTopic = currentTopic || state.selectedTopic;
            if (!targetTopic) throw new Error("No topic selected");

            const questions = await fetchQuestionsFromSheet(targetTopic);
            setEditorContent(questionsToText(questions));
            showToast('Questions fetched from sheet!', { type: 'success' });
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch from sheet', { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.authContainer}>
                    <h2 className={styles.title}>🔐 QA Editor Access</h2>
                    <input
                        type="password"
                        className={styles.passwordInput}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        autoFocus
                    />
                    <div className={styles.buttonGroup}>
                        <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button onClick={handleLogin} className={styles.loginBtn}>Unlock</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.editorContainer}>
                <div className={styles.header}>
                    <h2 className={styles.title}>📝 Question Editor</h2>
                    <button onClick={onClose} className={styles.closeHeaderBtn}>✕</button>
                </div>

                <div className={styles.toolbar}>
                    <button onClick={handleFetchFromSheet} className={styles.toolBtn} disabled={isLoading}>
                        {isLoading ? '⏳ Loading...' : '📥 Fetch from Sheet'}
                    </button>
                    <div className={styles.stats}>
                        {state.questions.length} active questions
                    </div>
                </div>

                <textarea
                    className={styles.editor}
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Paste parsed questions here..."
                />

                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                    <button onClick={handleSave} className={styles.saveBtn}>Apply Changes</button>
                </div>
            </div>
        </div>
    );
}
