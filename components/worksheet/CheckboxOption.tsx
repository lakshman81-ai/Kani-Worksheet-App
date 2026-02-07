import React from 'react';

interface CheckboxOptionProps {
  option: { id: string; text: string; isCorrect: boolean };
  isChecked: boolean;
  isDisabled: boolean;
  showCorrectness: boolean;
  onChange: (id: string, checked: boolean) => void;
}

const CheckboxOption: React.FC<CheckboxOptionProps> = ({
  option,
  isChecked,
  isDisabled,
  showCorrectness,
  onChange,
}) => {
  let className = "checkbox-option";
  let borderColor = "#e0e0e0";
  let backgroundColor = "#fafafa";

  if (showCorrectness) {
    if (isChecked && option.isCorrect) {
      className += " correct";
      borderColor = "#4caf50"; // Green
      backgroundColor = "#e8f5e9";
    } else if (isChecked && !option.isCorrect) {
      className += " incorrect";
      borderColor = "#f44336"; // Red
      backgroundColor = "#ffebee";
    } else if (!isChecked && option.isCorrect) {
      className += " missed";
      borderColor = "#ff9800"; // Orange
      backgroundColor = "#fff3e0";
    }
  } else if (isChecked) {
      borderColor = "#2196f3"; // Blue
      backgroundColor = "#e3f2fd";
  }

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        cursor: isDisabled ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        background: backgroundColor,
        marginBottom: '10px',
        opacity: isDisabled ? 0.9 : 1,
      }}
      className={className}
    >
      <input
        type="checkbox"
        checked={isChecked}
        disabled={isDisabled}
        onChange={(e) => onChange(option.id, e.target.checked)}
        aria-label={option.text}
        style={{
          width: '20px',
          height: '20px',
          marginRight: '12px',
          cursor: isDisabled ? 'default' : 'pointer',
          accentColor: showCorrectness ? (option.isCorrect ? '#4caf50' : '#f44336') : '#2196f3'
        }}
      />
      <span style={{ fontSize: '1.1rem', color: '#333', flex: 1, fontWeight: 500 }}>
        {option.text}
      </span>
      {showCorrectness && option.isCorrect && !isChecked && (
        <span style={{ color: '#ff9800', fontWeight: 'bold', fontSize: '0.9rem' }}>
          Missed
        </span>
      )}
      {showCorrectness && isChecked && option.isCorrect && (
        <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.2rem' }}>
          ✓
        </span>
      )}
      {showCorrectness && isChecked && !option.isCorrect && (
        <span style={{ color: '#f44336', fontWeight: 'bold', fontSize: '1.2rem' }}>
          ✗
        </span>
      )}
    </label>
  );
};

export default CheckboxOption;
