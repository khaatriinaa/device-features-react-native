import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StatusBar,
  InteractionManager,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDiary } from '../../context/DiaryContext';
import { useTheme } from '../../context/ThemeContext';
import EntryCard from '../../components/EntryCard';
import EmptyState from '../../components/EmptyState';
import ThemeToggle from '../../components/ThemeToggle';
import { TravelEntry } from '../../types/types';
import { HomeScreenProps } from '../../types/props';
import styles from './HomeScreen.styles';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { entries, removeEntry, loadEntries } = useDiary();
  const { colors, themeMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedOnce = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (hasLoadedOnce.current) return; // context already up-to-date after first load

      // ✅ KEY FIX: Defer the state-setting load until AFTER the tab
      // slide animation finishes. Without this, setState mid-animation
      // causes the layout jump / flicker you see.
      const task = InteractionManager.runAfterInteractions(() => {
        loadEntries();
        hasLoadedOnce.current = true;
      });

      return () => task.cancel(); // cleanup if screen blurs before task fires
    }, [loadEntries])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  }, [loadEntries]);

  const renderItem = useCallback(
    ({ item }: { item: TravelEntry }) => (
      <EntryCard entry={item} onRemove={removeEntry} />
    ),
    [removeEntry]
  );

  const keyExtractor = useCallback((item: TravelEntry) => item.id, []);

  return (
    // ✅ Use edges prop to avoid SafeAreaView conflicting with StatusBar on Android
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ── Header ── */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            ✈️ Travel Diary
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {entries.length} {entries.length === 1 ? 'memory' : 'memories'}
          </Text>
        </View>
        <ThemeToggle size={40} />
      </View>

      {/* ── List ── */}
      <FlatList
        data={entries}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={
          entries.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={<EmptyState message="No Entries yet" />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;