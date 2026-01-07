import { useState, useEffect } from 'react';

type ThemeMode = 'auto' | 'light' | 'dark';
type Theme = 'light' | 'dark';

export function useTheme() {
    const [mode, setMode] = useState<ThemeMode>('auto');
    const [theme, setTheme] = useState<Theme>('light');

    // Load saved mode from local storage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem('kegel_theme_mode') as ThemeMode;
        if (savedMode) {
            setMode(savedMode);
        }
    }, []);

    // Determine actual theme based on mode and time
    useEffect(() => {
        const calculateTheme = () => {
            if (mode === 'light') return 'light';
            if (mode === 'dark') return 'dark';

            // Auto mode: Dark between 7 PM (19:00) and 6 AM (06:00)
            const hour = new Date().getHours();
            const isNight = hour >= 19 || hour < 6;
            return isNight ? 'dark' : 'light';
        };

        const newTheme = calculateTheme();
        setTheme(newTheme);

        // Apply to document
        document.documentElement.setAttribute('data-theme', newTheme);

        // Save preference
        localStorage.setItem('kegel_theme_mode', mode);

    }, [mode]);

    return { mode, setMode, theme };
}
