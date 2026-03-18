import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryContextType, TravelEntry } from '../types/types';
import { STORAGE_KEY } from '../utils/AsyncStorage';

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

interface DiaryProviderProps {
  children: ReactNode;
}

export const DiaryProvider: React.FC<DiaryProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = useCallback(async (): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed: TravelEntry[] = JSON.parse(stored);
        setEntries(parsed);
      }
    } catch (e) {
      console.log('Failed to load entries.');
    }
  }, []);

  const addEntry = useCallback(async (entry: TravelEntry): Promise<void> => {
    try {
      // Use functional updater to avoid stale closures
      setEntries((prev) => {
        const updatedEntries = [entry, ...prev];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries)).catch(() =>
          console.log('Failed to persist entry.')
        );
        return updatedEntries;
      });
    } catch (e) {
      console.log('Failed to save entry.');
      throw e;
    }
  }, []);

  const removeEntry = useCallback(async (id: string): Promise<void> => {
    try {
      setEntries((prev) => {
        const updatedEntries = prev.filter((e) => e.id !== id);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries)).catch(() =>
          console.log('Failed to persist after removal.')
        );
        return updatedEntries;
      });
    } catch (e) {
      console.log('Failed to remove entry.');
      throw e;
    }
  }, []);

  // Memoize context value — only changes when entries/callbacks change
  const value = useMemo<DiaryContextType>(
    () => ({ entries, addEntry, removeEntry, loadEntries }),
    [entries, addEntry, removeEntry, loadEntries]
  );

  return (
    <DiaryContext.Provider value={value}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = (): DiaryContextType => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};