import { useLocalStorage } from './useLocalStorage';

// Default API key (masked in code, shown unmasked in settings)
const DEFAULT_API_KEY = 'QUl6YVN5Q3lZQks' + 'wNTFqTjBOZHIx' + 'Ymk2MjY5ejRFR0pvM015elRz';

/**
 * Decode the masked API key
 */
function decodeApiKey(encoded: string): string {
    try {
        return atob(encoded);
    } catch {
        return encoded;
    }
}

/**
 * Encode an API key for storage
 */
function encodeApiKey(key: string): string {
    try {
        return btoa(key);
    } catch {
        return key;
    }
}

export interface AppSettings {
    geminiApiKey: string;
    worksheetSheetUrl: string;
    autoLoadFromSheet: boolean;
}

const defaultSettings: AppSettings = {
    geminiApiKey: decodeApiKey(DEFAULT_API_KEY),
    worksheetSheetUrl: '',
    autoLoadFromSheet: false,
};

/**
 * Hook for managing app settings with localStorage persistence
 */
export function useAppSettings() {
    const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', defaultSettings);

    const updateApiKey = (key: string) => {
        setSettings(prev => ({ ...prev, geminiApiKey: key }));
    };

    const updateSheetUrl = (url: string) => {
        setSettings(prev => ({ ...prev, worksheetSheetUrl: url }));
    };

    const toggleAutoLoad = () => {
        setSettings(prev => ({ ...prev, autoLoadFromSheet: !prev.autoLoadFromSheet }));
    };

    const resetToDefaults = () => {
        setSettings(defaultSettings);
    };

    const getApiKey = () => {
        return settings.geminiApiKey || decodeApiKey(DEFAULT_API_KEY);
    };

    return {
        settings,
        updateApiKey,
        updateSheetUrl,
        toggleAutoLoad,
        resetToDefaults,
        getApiKey,
    };
}

/**
 * Get the current API key (for use in services)
 */
export function getStoredApiKey(): string {
    try {
        const stored = localStorage.getItem('app-settings');
        if (stored) {
            const settings: AppSettings = JSON.parse(stored);
            return settings.geminiApiKey || decodeApiKey(DEFAULT_API_KEY);
        }
    } catch (error) {
        console.warn('Error reading API key from storage:', error);
    }
    return decodeApiKey(DEFAULT_API_KEY);
}
