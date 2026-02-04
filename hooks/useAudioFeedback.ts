import { useCallback, useRef, useEffect } from 'react';

// Audio file URLs (using Web Audio API with oscillator for simple sounds)
interface AudioFeedbackOptions {
    enabled?: boolean;
    volume?: number;
}

export function useAudioFeedback(options: AudioFeedbackOptions = {}) {
    const { enabled = true, volume = 0.3 } = options;
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on first user interaction
        const initAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
        };

        window.addEventListener('click', initAudio, { once: true });
        return () => window.removeEventListener('click', initAudio);
    }, []);

    const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
        if (!enabled || !audioContextRef.current) return;

        try {
            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }, [enabled, volume]);

    const playCorrect = useCallback(() => {
        // Happy ascending notes
        playTone(523.25, 0.15, 'sine'); // C5
        setTimeout(() => playTone(659.25, 0.15, 'sine'), 100); // E5
        setTimeout(() => playTone(783.99, 0.2, 'sine'), 200); // G5
    }, [playTone]);

    const playIncorrect = useCallback(() => {
        // Descending buzzer
        playTone(300, 0.3, 'square');
    }, [playTone]);

    const playClick = useCallback(() => {
        playTone(800, 0.05, 'sine');
    }, [playTone]);

    const playSuccess = useCallback(() => {
        // Victory fanfare
        playTone(523.25, 0.1, 'sine'); // C5
        setTimeout(() => playTone(659.25, 0.1, 'sine'), 100); // E5
        setTimeout(() => playTone(783.99, 0.1, 'sine'), 200); // G5
        setTimeout(() => playTone(1046.50, 0.3, 'sine'), 300); // C6
    }, [playTone]);

    return {
        playCorrect,
        playIncorrect,
        playClick,
        playSuccess,
    };
}
