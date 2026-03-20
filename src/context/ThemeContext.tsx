import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContextType, ThemeMode } from '../types/types';
import { lightColors, darkColors } from '../constants/theme';
import { THEME_STORAGE_KEY } from '../utils/AsyncStorage';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps { children: ReactNode }

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  // Load persisted theme once on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        setThemeMode(saved);
      }
    }).catch(() => console.log('Failed to load theme.'));
  }, []);

  // Stable toggle — uses functional updater so it never reads stale state
  const toggleTheme = useCallback((): void => {
    setThemeMode((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() =>
        console.log('Failed to save theme.')
      );
      return next;
    });
  }, []); 

  const colors = useMemo(
    () => (themeMode === 'light' ? lightColors : darkColors),
    [themeMode]
  );

  const value = useMemo<ThemeContextType>(
    () => ({ themeMode, toggleTheme, colors }),
    [themeMode, toggleTheme, colors]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};