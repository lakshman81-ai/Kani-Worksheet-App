import React from 'react';

interface FeedbackPanelProps {
  feedback: {
    message: string;
    type: 'success' | 'warning' | 'error';
    details?: {
      correctSelections: string[];
      incorrectSelections: string[];
      missedAnswers: string[];
    };
  };
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback }) => {
  const { message, type } = feedback;

  let bgColor = '#e8f5e9';
  let borderColor = '#4caf50';
  let textColor = '#2e7d32';
  let icon = '🎉';

  if (type === 'error') {
    bgColor = '#ffebee';
    borderColor = '#f44336';
    textColor = '#c62828';
    icon = '❌';
  } else if (type === 'warning') {
    bgColor = '#fff3e0';
    borderColor = '#ff9800';
    textColor = '#ef6c00';
    icon = '⚠️';
  }

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '16px',
        background: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideUp 0.3s ease',
      }}
    >
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem', color: textColor }}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default FeedbackPanel;
