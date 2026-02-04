import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import SettingsScreen from '../screens/SettingsScreen';

// Mock the context hooks
vi.mock('../../hooks/useAppSettings', () => ({
    useAppSettings: () => ({
        settings: {
            playerName: 'Test User',
            mascotEmoji: '🦉',
            apiKey: 'test-api-key',
        },
        updateSettings: vi.fn(),
    }),
    getStoredApiKey: () => 'test-api-key',
}));

vi.mock('../../context/QuizContext', () => ({
    useQuiz: () => ({
        dispatch: vi.fn(),
        state: {
            interfaceStyle: 'kid',
            randomize: true,
        }
    }),
}));

vi.mock('../../context/ThemeContext', () => ({
    useTheme: () => ({
        themeIndex: 0,
        setThemeByIndex: vi.fn(),
    }),
    THEMES: [
        { name: 'Unicorn', buttonGrad1: '#fff', buttonGrad2: '#000', accent: '#f00' }
    ]
}));

// Mock the service
vi.mock('../../services/geminiService', () => ({
    validateApiKey: vi.fn().mockResolvedValue(true),
}));

describe('SettingsScreen', () => {
    const defaultProps = {
        topicConfigs: [],
        onGenerateWorksheet: vi.fn(),
    };

    it('renders API Key Test button when API key is present or typed', () => {
        render(<SettingsScreen {...defaultProps} />);

        const showButton = screen.getByText('👁️');
        fireEvent.click(showButton);

        const testButton = screen.getByText('Test');
        expect(testButton).toBeInTheDocument();
    });

    it('validates API key when Test button is clicked', async () => {
        render(<SettingsScreen {...defaultProps} />);

        const showButton = screen.getByText('👁️');
        fireEvent.click(showButton); // Show inputs

        const testButton = screen.getByText('Test');
        fireEvent.click(testButton);

        await waitFor(() => {
            expect(screen.getByText('testing...', { exact: false })).toBeInTheDocument();
        });
    });
});
