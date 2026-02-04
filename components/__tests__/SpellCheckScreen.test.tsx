import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import SpellCheckScreen from '../SpellCheckScreen';

// Mock speech synthesis
const mockSpeak = vi.fn();
window.speechSynthesis = {
    speak: mockSpeak,
    cancel: vi.fn(),
    getVoices: () => [],
} as any;
window.SpeechSynthesisUtterance = vi.fn() as any;

describe('SpellCheckScreen', () => {
    const defaultProps = {
        onBack: vi.fn(),
        playerName: 'Test Player',
        mascotEmoji: '🦉'
    };

    it('renders landing page initially', () => {
        render(<SpellCheckScreen {...defaultProps} />);
        expect(screen.getByText('Spell Check')).toBeInTheDocument();
        expect(screen.getByText('Choose Your Challenge')).toBeInTheDocument();
    });

    it('maintains focus when typing in Spell Challenge mode', async () => {
        render(<SpellCheckScreen {...defaultProps} />);

        // Navigate to Spell Challenge
        const playButton = screen.getAllByText('Play Now')[0];
        fireEvent.click(playButton);

        // Verify we are on the game screen by finding unique elements
        expect(screen.getByText(/Full Word/i)).toBeInTheDocument();

        // Find input
        const input = screen.getByPlaceholderText(/Type here.../i);
        expect(input).toBeInTheDocument();

        // Type a character
        input.focus();
        fireEvent.change(input, { target: { value: 'a' } });

        // Verify focus is still on input
        // NOTE: In JSDOM, focus might not work exactly like a browser without some help, 
        // but we can check if the element document.activeElement is our input.
        // However, the main bug became apparent because the component would Unmount/Remount, losing focus.
        // If the component re-renders properly, the input instance should remain the same.

        expect(document.activeElement).toBe(input);

        // Type more
        fireEvent.change(input, { target: { value: 'ab' } });
        expect(document.activeElement).toBe(input);
    });
});
