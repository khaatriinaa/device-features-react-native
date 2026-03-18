import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  const loadEntries = async (): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed: TravelEntry[] = JSON.parse(stored);
        setEntries(parsed);
      }
    } catch (e) {
      console.log('Failed to load entries.');
    }
  };

  const addEntry = async (entry: TravelEntry): Promise<void> => {
    try {
      const updatedEntries = [entry, ...entries];
      setEntries(updatedEntries);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (e) {
      console.log('Failed to save entry.');
      throw e;
    }
  };

  const removeEntry = async (id: string): Promise<void> => {
    try {
      const updatedEntries = entries.filter((e) => e.id !== id);
      setEntries(updatedEntries);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (e) {
      console.log('Failed to remove entry.');
      throw e;
    }
  };

  return (
    <DiaryContext.Provider value={{ entries, addEntry, removeEntry, loadEntries }}>
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
