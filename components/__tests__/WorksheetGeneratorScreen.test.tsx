import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import WorksheetGeneratorScreen from '../screens/WorksheetGeneratorScreen';

// Mock contexts
vi.mock('../../context/QuizContext', () => ({
    useQuiz: () => ({
        dispatch: vi.fn(),
    }),
}));

vi.mock('../../hooks/useAppSettings', () => ({
    useAppSettings: () => ({
        settings: { worksheetSheetUrl: '' },
    }),
}));

describe('WorksheetGeneratorScreen', () => {
    it('renders Toggle Switch for modes', () => {
        render(<WorksheetGeneratorScreen />);

        expect(screen.getByText('🤖 AI Generator')).toBeInTheDocument();
        expect(screen.getByText('📊 Google Sheet')).toBeInTheDocument();
    });

    it('switches to Sheet mode when toggle is clicked', () => {
        render(<WorksheetGeneratorScreen />);

        const sheetButton = screen.getByText('📊 Google Sheet');
        fireEvent.click(sheetButton);

        expect(screen.getByText(/Import from Google Sheet/i)).toBeInTheDocument();
        expect(screen.queryByText(/AI Question Generator/i)).not.toBeInTheDocument();
    });

    it('switches to AI mode when toggle is clicked', () => {
        render(<WorksheetGeneratorScreen />);

        // Switch to sheet first
        fireEvent.click(screen.getByText('📊 Google Sheet'));

        // Switch back to AI
        fireEvent.click(screen.getByText('🤖 AI Generator'));

        expect(screen.getByText(/AI Question Generator/i)).toBeInTheDocument();
    });
});
