import React, { useCallback, useState, useRef } from 'react';
import {
  View, Text, FlatList, RefreshControl,
  StatusBar, InteractionManager, Pressable, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDiary } from '../../context/DiaryContext';
import { useTheme } from '../../context/ThemeContext';
import EmptyState from '../../components/EmptyState';
import ThemeToggle from '../../components/ThemeToggle';
import { TravelEntry } from '../../types/types';
import { HomeScreenProps, RootStackNavigationProp } from '../../types/props';
import styles from './HomeScreen.styles';

// ── Featured card ─────────────────────────────────────────────────────────────
const FeaturedCard: React.FC<{
  entry: TravelEntry;
  onRemove: (id: string) => void;
  onPress: (entry: TravelEntry) => void;
  colors: any;
}> = ({ entry, onRemove, onPress, colors }) => {
  const parts = entry.address.split(',').map((s) => s.trim()).filter(Boolean);
  const city  = parts[1] || parts[0] || entry.address;

  const confirmRemove = () =>
    Alert.alert('Delete Entry', 'Remove this travel memory?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onRemove(entry.id) },
    ]);

  return (
    <Pressable
      onPress={() => onPress(entry)}
      onLongPress={confirmRemove}
      delayLongPress={450}
      style={[styles.featuredWrap, { shadowColor: colors.shadow }]}
    >
      <Image source={{ uri: entry.imageUri }} style={styles.featuredImage} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.65)']}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 140 }}
      />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle} numberOfLines={1}>
          {entry.title || 'Travel Memory'}
        </Text>
        <Text style={styles.featuredSub} numberOfLines={1}>{city}</Text>
      </View>
    </Pressable>
  );
};

// ── Row card ──────────────────────────────────────────────────────────────────
const RowCard: React.FC<{
  entry: TravelEntry;
  onRemove: (id: string) => void;
  onPress: (entry: TravelEntry) => void;
  colors: any;
}> = ({ entry, onRemove, onPress, colors }) => {
  const parts   = entry.address.split(',').map((s) => s.trim()).filter(Boolean);
  const city    = parts[1] || parts[0] || entry.address;
  const country = parts[parts.length - 2] || '';
  const tag     = (parts[2] || parts[1] || 'TRAVEL').toUpperCase().slice(0, 18);
  const date    = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const confirmRemove = () =>
    Alert.alert('Delete Entry', 'Remove this travel memory?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onRemove(entry.id) },
    ]);

  return (
    <Pressable
      onPress={() => onPress(entry)}
      onLongPress={confirmRemove}
      delayLongPress={450}
      style={[styles.rowCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
    >
      <Image source={{ uri: entry.imageUri }} style={styles.rowThumb} resizeMode="cover" />
      <View style={styles.rowContent}>
        <Text style={[styles.rowCategory, { color: colors.primary }]}>{tag}</Text>
        <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={2}>
          {entry.title || 'Travel Memory'}
        </Text>
        <Text style={[styles.rowCity, { color: colors.textSecondary }]} numberOfLines={1}>
          {city}{country ? `, ${country}` : ''}
        </Text>
        <View style={styles.rowMeta}>
          <Text style={[styles.rowMetaText, { color: colors.placeholder }]}>🕐 {date}</Text>
        </View>
      </View>
    </Pressable>
  );
};

// ── HomeScreen ────────────────────────────────────────────────────────────────
const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { entries, removeEntry, loadEntries } = useDiary();
  const { colors, themeMode } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedOnce = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (hasLoadedOnce.current) return;
      const task = InteractionManager.runAfterInteractions(() => {
        loadEntries();
        hasLoadedOnce.current = true;
      });
      return () => task.cancel();
    }, [loadEntries])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  }, [loadEntries]);

  const openDetail = useCallback(
    (entry: TravelEntry) => navigation.navigate('EntryDetail', { entry }),
    [navigation]
  );

  const featured = entries[0] ?? null;
  const rest     = entries.slice(1);

  const renderRow = useCallback(
    ({ item }: { item: TravelEntry }) => (
      <RowCard entry={item} onRemove={removeEntry} onPress={openDetail} colors={colors} />
    ),
    [removeEntry, openDetail, colors]
  );

  const keyExtractor = useCallback((item: TravelEntry) => item.id, []);

  // ── Empty state: shown only when there are truly no entries ──────────────
  if (entries.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.hamburger}>
              <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
              <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
              <View style={[styles.hamburgerLine, { backgroundColor: colors.text, width: 14 }]} />
            </View>
          </View>
          <View style={styles.brandRow}>
            <Text style={[styles.brandWord, { color: colors.primary }]}>WANDR</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <ThemeToggle size={38} />
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <EmptyState message="No entries yet" />
        </View>
      </SafeAreaView>
    );
  }

  // ── Has entries ───────────────────────────────────────────────────────────
  const ListHeader = (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Journal</Text>
      </View>
      <FeaturedCard entry={featured!} onRemove={removeEntry} onPress={openDetail} colors={colors} />

      {rest.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All Entries</Text>
          <Text style={[styles.sectionCount, { color: colors.primary }]}>
            {entries.length} total
          </Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.hamburger}>
            <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: colors.text, width: 14 }]} />
          </View>
        </View>
        <View style={styles.brandRow}>
          <Text style={[styles.brandWord, { color: colors.primary }]}>WANDR</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <ThemeToggle size={38} />
        </View>
      </View>

      {/*
        FlatList data={rest} — only the entries after the featured one.
        ListHeaderComponent renders the featured card + section headers.
        ListEmptyComponent only fires when rest is empty (i.e. exactly 1 entry),
        but we guard against that by NOT rendering it here — the featured card
        in the header already shows that single entry.
      */}
      <FlatList
        data={rest}
        keyExtractor={keyExtractor}
        renderItem={renderRow}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
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