import React, { useState, useEffect } from 'react';
import { logger, LogEntry } from '../../services/loggingService';
import styles from '../../styles/SettingsScreen.module.css'; // Reusing settings styles for now or inline

interface ErrorLogModalProps {
    onClose: () => void;
}

export default function ErrorLogModal({ onClose }: ErrorLogModalProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        setLogs(logger.getLogs());
        // Subscribe to new logs
        const unsubscribe = logger.subscribe((log) => {
            setLogs(prev => [log, ...prev]);
        });
        return unsubscribe;
    }, []);

    const handleCopy = () => {
        const text = logs.map(l => `[${l.level}] ${new Date(l.timestamp).toISOString()}: ${l.message}\n${JSON.stringify(l.details || '')}`).join('\n');
        navigator.clipboard.writeText(text);
        alert('Logs copied to clipboard!');
    };

    const handleClear = () => {
        logger.clear();
        setLogs([]);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: '#1e1e2e',
                width: '90%',
                maxWidth: '600px',
                height: '80vh',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid #4caf50'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#fff' }}>🐞 Application Logs</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
                    {logs.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No logs available.</div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} style={{
                                marginBottom: '10px',
                                padding: '10px',
                                backgroundColor: log.level === 'ERROR' ? 'rgba(255,0,0,0.1)' : 'rgba(255,255,255,0.05)',
                                borderLeft: `3px solid ${log.level === 'ERROR' ? '#ff5252' : log.level === 'WARN' ? '#ffb74d' : '#4caf50'}`,
                                borderRadius: '4px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'rgba(255,255,255,0.5)' }}>
                                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    <span style={{ fontWeight: 'bold', color: log.level === 'ERROR' ? '#ff5252' : 'inherit' }}>{log.level}</span>
                                </div>
                                <div style={{ color: '#fff', whiteSpace: 'pre-wrap' }}>{log.message}</div>
                                {log.details && (
                                    <pre style={{ marginTop: '5px', overflowX: 'auto', color: 'rgba(255,255,255,0.7)' }}>
                                        {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
                                    </pre>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
                    <button onClick={handleCopy} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#3f51b5', color: '#fff', cursor: 'pointer' }}>Copy System Info</button>
                    <button onClick={handleClear} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#f44336', color: '#fff', cursor: 'pointer' }}>Clear Logs</button>
                </div>
            </div>
        </div>
    );
}
