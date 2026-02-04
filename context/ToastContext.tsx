import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Toast {
    id: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    showToast: (message: string, options?: { type?: Toast['type']; duration?: number }) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((
        message: string,
        options?: { type?: Toast['type']; duration?: number }
    ) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const duration = options?.duration ?? 2500;
        const type = options?.type ?? 'info';

        const toast: Toast = { id, message, type, duration };
        setToasts(prev => [...prev, toast]);

        // Auto-remove after duration
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const value: ToastContextValue = {
        toasts,
        showToast,
        removeToast,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Toast Container Component
interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    const getToastStyles = (type: Toast['type']) => {
        switch (type) {
            case 'success':
                return { background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', color: '#2e7d32', borderColor: '#4caf50' };
            case 'error':
                return { background: 'linear-gradient(135deg, #ffebee, #ffcdd2)', color: '#c62828', borderColor: '#ef5350' };
            case 'warning':
                return { background: 'linear-gradient(135deg, #fff8e1, #ffecb3)', color: '#f57f17', borderColor: '#ffc107' };
            default:
                return { background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', color: '#1565c0', borderColor: '#2196f3' };
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '350px',
        }}>
            {toasts.map(toast => {
                const styles = getToastStyles(toast.type);
                return (
                    <div
                        key={toast.id}
                        onClick={() => onRemove(toast.id)}
                        style={{
                            padding: '14px 20px',
                            borderRadius: '12px',
                            background: styles.background,
                            color: styles.color,
                            borderLeft: `4px solid ${styles.borderColor}`,
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                            fontWeight: 700,
                            fontSize: '14px',
                            cursor: 'pointer',
                            animation: 'toastSlideIn 0.3s ease',
                        }}
                    >
                        {toast.message}
                    </div>
                );
            })}
            <style>{`
                @keyframes toastSlideIn {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}
