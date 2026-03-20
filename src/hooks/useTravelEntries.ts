import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelEntry } from '../types/types';
import { STORAGE_KEY } from '../utils/AsyncStorage';

const useTravelEntries = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved entries on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value !== null) {
          setEntries(JSON.parse(value));
        }
      } catch (e) {
        console.log('Failed to load entries.');
      } finally {
        setLoading(false);
      }
    };
    loadEntries();
  }, []);

  const addEntry = useCallback(async (entry: TravelEntry): Promise<void> => {
    try {
      const updated = [entry, ...entries];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setEntries(updated);
    } catch (e) {
      console.log('Failed to save entry.');
      throw e;
    }
  }, [entries]);

  const removeEntry = useCallback(async (id: string): Promise<void> => {
    try {
      const updated = entries.filter(e => e.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setEntries(updated);
    } catch (e) {
      console.log('Failed to remove entry.');
      throw e;
    }
  }, [entries]);

  const refreshEntries = useCallback(async (): Promise<void> => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        setEntries(JSON.parse(value));
      }
    } catch (e) {
      console.log('Failed to refresh entries.');
    }
  }, []);

  return { entries, loading, addEntry, removeEntry, refreshEntries };
};

export default useTravelEntries;
