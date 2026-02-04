import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme definitions matching OLD MCQ App
export interface Theme {
    name: string;
    accent: string;
    buttonGrad1: string;
    buttonGrad2: string;
    border: string;
    headerText: string;
}

export const THEMES: Theme[] = [
    {
        name: 'sunshine',
        accent: '#FFD54F',
        buttonGrad1: '#FFD54F',
        buttonGrad2: '#FFC107',
        border: '#FFD54F',
        headerText: '#DB2777'
    },
    {
        name: 'ocean',
        accent: '#76B7FF',
        buttonGrad1: '#BFE6FF',
        buttonGrad2: '#76B7FF',
        border: '#76B7FF',
        headerText: '#0EA5A0'
    },
    {
        name: 'mint',
        accent: '#34D399',
        buttonGrad1: '#A7F3D0',
        buttonGrad2: '#34D399',
        border: '#34D399',
        headerText: '#065F46'
    },
    {
        name: 'peach',
        accent: '#FF8C00',
        buttonGrad1: '#FFB86B',
        buttonGrad2: '#FF8C00',
        border: '#FF8C00',
        headerText: '#9A3412'
    }
];

interface ThemeContextValue {
    theme: Theme;
    themeIndex: number;
    cycleTheme: () => void;
    setThemeByIndex: (index: number) => void;
    setThemeByName: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [themeIndex, setThemeIndex] = useState<number>(() => {
        // Load from localStorage or default to 0
        try {
            const saved = localStorage.getItem('app-theme-index');
            return saved ? parseInt(saved, 10) : 0;
        } catch {
            return 0;
        }
    });

    const theme = THEMES[themeIndex] || THEMES[0];

    // Apply CSS variables when theme changes
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--button-grad-1', theme.buttonGrad1);
        root.style.setProperty('--button-grad-2', theme.buttonGrad2);
        root.style.setProperty('--form-border', theme.border);
        root.style.setProperty('--header-text', theme.headerText);

        // Save to localStorage
        try {
            localStorage.setItem('app-theme-index', themeIndex.toString());
        } catch {
            // Ignore storage errors
        }
    }, [theme, themeIndex]);

    const cycleTheme = () => {
        setThemeIndex((prev) => (prev + 1) % THEMES.length);
    };

    const setThemeByIndex = (index: number) => {
        if (index >= 0 && index < THEMES.length) {
            setThemeIndex(index);
        }
    };

    const setThemeByName = (name: string) => {
        const index = THEMES.findIndex(t => t.name === name);
        if (index >= 0) {
            setThemeIndex(index);
        }
    };

    const value: ThemeContextValue = {
        theme,
        themeIndex,
        cycleTheme,
        setThemeByIndex,
        setThemeByName,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
