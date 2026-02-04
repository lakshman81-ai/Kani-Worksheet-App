import React, { useState } from 'react';
import styles from '../../styles/shared.module.css';

interface PasswordModalProps {
    onSubmit: () => void;
    onCancel: () => void;
    correctPassword?: string;
}

export default function PasswordModal({
    onSubmit,
    onCancel,
    correctPassword = 'Superdad'
}: PasswordModalProps) {
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const handleSubmit = () => {
        if (passwordInput === correctPassword) {
            setPasswordInput('');
            setPasswordError(false);
            onSubmit();
        } else {
            setPasswordError(true);
        }
    };

    const handleCancel = () => {
        setPasswordInput('');
        setPasswordError(false);
        onCancel();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div
            className={styles.modalOverlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-modal-title"
        >
            <div className={styles.modalCard}>
                <h2 id="password-modal-title" className={styles.modalTitle}>
                    🔒 Enter Password
                </h2>
                <p className={styles.modalSubtitle}>
                    Settings are password protected
                </p>
                <input
                    type="password"
                    placeholder="Password..."
                    value={passwordInput}
                    onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError(false);
                    }}
                    onKeyPress={handleKeyPress}
                    className={styles.modalInput}
                    style={{ borderColor: passwordError ? '#f44336' : undefined }}
                    autoFocus
                    aria-describedby={passwordError ? 'password-error' : undefined}
                />
                {passwordError && (
                    <p id="password-error" className={styles.modalError}>
                        ❌ Incorrect password
                    </p>
                )}
                <div className={styles.modalButtons}>
                    <button
                        className={styles.modalCancelBtn}
                        onClick={handleCancel}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.modalSubmitBtn}
                        onClick={handleSubmit}
                        type="button"
                    >
                        Unlock
                    </button>
                </div>
            </div>
        </div>
    );
}
