import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, RefreshControl, StatusBar,
  InteractionManager, Pressable, Alert, Image,
  Animated, Dimensions, TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDiary } from '../../context/DiaryContext';
import { useTheme } from '../../context/ThemeContext';
import EmptyState from '../../components/EmptyState';
import { TravelEntry } from '../../types/types';
import { HomeScreenProps, RootStackNavigationProp } from '../../types/props';
import styles from './HomeScreen.styles';

const { width: SCREEN_W } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_W * 0.72;

// ── Drawer Menu ───────────────────────────────────────────────────────────────
const DrawerMenu: React.FC<{
  visible: boolean;
  onClose: () => void;
  colors: any;
  themeMode: string;
  toggleTheme: () => void;
  entryCount: number;
  onClearAll: () => void;
  onAddTrip: () => void;
}> = ({ visible, onClose, colors, themeMode, toggleTheme, entryCount, onClearAll, onAddTrip }) => {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const insets    = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 0 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setIsMounted(false);
      });
    }
  }, [visible]);

  if (!isMounted) return null;

  const menuItems = [
    {
      icon: '🏠',
      label: 'Home',
      sub: 'Your journal',
      onPress: () => { onClose(); },
    },
    {
      icon: '✈️',
      label: 'Add Trip',
      sub: 'Create a new memory',
      onPress: () => { onClose(); onAddTrip(); },
    },
    {
      icon: '📍',
      label: 'Map View',
      sub: 'Coming soon',
      onPress: () => { Alert.alert('Map View', 'This feature is coming soon!'); onClose(); },
    },
    {
      icon: '📤',
      label: 'Export',
      sub: 'Coming soon',
      onPress: () => { Alert.alert('Export', 'This feature is coming soon!'); onClose(); },
    },
  ];

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            opacity: fadeAnim,
          }}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: DRAWER_WIDTH,
          backgroundColor: colors.surface,
          transform: [{ translateX: slideAnim }],
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          shadowColor: '#000',
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.18,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        {/* App identity */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ fontSize: 26, fontWeight: '900', letterSpacing: 3, color: colors.primary }}>
            WANDR
          </Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 3 }}>
            Your travel diary
          </Text>
        </View>

        {/* Stats card */}
        <View style={{
          marginHorizontal: 20, marginTop: 20, marginBottom: 4,
          backgroundColor: colors.primaryLight,
          borderRadius: 16, padding: 16,
          flexDirection: 'row', alignItems: 'center', gap: 14,
        }}>
          <Text style={{ fontSize: 28 }}>🗺️</Text>
          <View>
            <Text style={{ fontSize: 22, fontWeight: '900', color: colors.primary }}>{entryCount}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '500' }}>
              {entryCount === 1 ? 'memory saved' : 'memories saved'}
            </Text>
          </View>
        </View>

        {/* Menu items */}
        <View style={{ flex: 1, paddingTop: 4 }}>
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => ({
                flexDirection: 'row', alignItems: 'center', gap: 14,
                paddingHorizontal: 24, paddingVertical: 14,
                backgroundColor: pressed ? colors.primaryLight : 'transparent',
              })}
              onPress={item.onPress}
            >
              <Text style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{item.label}</Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>{item.sub}</Text>
              </View>
              {item.sub === 'Coming soon' && (
                <View style={{
                  backgroundColor: colors.border,
                  paddingHorizontal: 7, paddingVertical: 2,
                  borderRadius: 8,
                }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.5 }}>
                    SOON
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Bottom: theme toggle + clear all */}
        <View style={{ paddingHorizontal: 24, gap: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 18 }}>{themeMode === 'light' ? '☀️' : '🌙'}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                {themeMode === 'light' ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor="#fff"
              ios_backgroundColor="#D1D5DB"
            />
          </View>

          {entryCount > 0 && (
            <Pressable
              onPress={() => {
                onClose();
                Alert.alert(
                  'Clear All Entries',
                  `This will permanently delete all ${entryCount} travel memories. Are you sure?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete All', style: 'destructive', onPress: onClearAll },
                  ]
                );
              }}
              style={({ pressed }) => ({
                flexDirection: 'row', alignItems: 'center', gap: 10,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text style={{ fontSize: 16 }}>🗑️</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.danger }}>Clear All Entries</Text>
            </Pressable>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

// ── Featured card ─────────────────────────────────────────────────────────────
const FeaturedCard: React.FC<{
  entry: TravelEntry;
  onRemove: (id: string) => void;
  onPress: (entry: TravelEntry) => void;
  colors: any;
}> = ({ entry, onRemove, onPress, colors }) => {
  const parts = entry.address.split(',').map((s) => s.trim()).filter(Boolean);
  const city  = parts[1] || parts[0] || entry.address;
  const date  = new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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
        colors={['transparent', 'rgba(0,0,0,0.72)']}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 160 }}
      />
      {/* Top row: date pill left, delete right */}
      <View style={{ position: 'absolute', top: 14, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.42)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>{date}</Text>
        </View>
        <Pressable
          onPress={confirmRemove}
          hitSlop={8}
          style={({ pressed }) => ({
            backgroundColor: pressed ? 'rgba(239,68,68,0.85)' : 'rgba(239,68,68,0.7)',
            width: 34, height: 34, borderRadius: 17,
            alignItems: 'center', justifyContent: 'center',
          })}
        >
          <Text style={{ fontSize: 15 }}>🗑</Text>
        </Pressable>
      </View>
      <View style={styles.featuredOverlay}>
        <View style={{
          alignSelf: 'flex-start',
          backgroundColor: colors.primary,
          paddingHorizontal: 8, paddingVertical: 3,
          borderRadius: 6, marginBottom: 6,
        }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }}>LATEST</Text>
        </View>
        <Text style={styles.featuredTitle} numberOfLines={1}>{entry.title || 'Travel Memory'}</Text>
        <Text style={styles.featuredSub} numberOfLines={1}>📍 {city}</Text>
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
  const date    = new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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
        <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={2}>{entry.title || 'Travel Memory'}</Text>
        <Text style={[styles.rowCity, { color: colors.textSecondary }]} numberOfLines={1}>
          {city}{country ? `, ${country}` : ''}
        </Text>
        <View style={styles.rowMeta}>
          <Text style={[styles.rowMetaText, { color: colors.placeholder }]}>🕐 {date}</Text>
        </View>
      </View>
      {/* Visible delete button */}
      <Pressable
        onPress={confirmRemove}
        hitSlop={8}
        style={({ pressed }) => ({
          paddingHorizontal: 12, paddingVertical: 8, marginRight: 12,
          backgroundColor: pressed ? '#FEE2E2' : '#FEF2F2',
          borderRadius: 10, alignSelf: 'center',
          borderWidth: 1, borderColor: '#FECACA',
        })}
      >
        <Text style={{ fontSize: 16 }}>🗑</Text>
      </Pressable>
    </Pressable>
  );
};

// ── HomeScreen ────────────────────────────────────────────────────────────────
const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { entries, removeEntry, loadEntries } = useDiary();
  const { colors, themeMode, toggleTheme } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const handleAddTrip = useCallback(() => {
    navigation.navigate('Main', { screen: 'AddEntry' } as any);
  }, [navigation]);

  const handleClearAll = useCallback(async () => {
    for (const e of entries) {
      await removeEntry(e.id);
    }
  }, [entries, removeEntry]);

  const featured = entries[0] ?? null;
  const rest     = entries.slice(1);

  const renderRow = useCallback(
    ({ item }: { item: TravelEntry }) => (
      <RowCard entry={item} onRemove={removeEntry} onPress={openDetail} colors={colors} />
    ),
    [removeEntry, openDetail, colors]
  );

  const keyExtractor = useCallback((item: TravelEntry) => item.id, []);

  const Header = (
    <View style={styles.header}>
      <Pressable
        onPress={() => setDrawerOpen(true)}
        hitSlop={10}
        style={({ pressed }) => [
          styles.headerIconBtn,
          { backgroundColor: pressed ? colors.primaryLight : colors.inputBackground },
        ]}
      >
        <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
        <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
        <View style={[styles.hamburgerLine, { backgroundColor: colors.text, width: 14 }]} />
      </Pressable>

      <Text style={[styles.brandWord, { color: colors.primary }]}>WANDR</Text>

      <View style={styles.themeToggleWrap}>
        <Text style={{ fontSize: 13 }}>{themeMode === 'light' ? '☀️' : '🌙'}</Text>
        <Switch
          value={themeMode === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#D1D5DB', true: colors.primary }}
          thumbColor="#fff"
          ios_backgroundColor="#D1D5DB"
          style={{ transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }] }}
        />
      </View>
    </View>
  );

  if (entries.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        {Header}
        <View style={styles.emptyContainer}>
          <EmptyState message="No entries yet" />
        </View>
        <DrawerMenu
          visible={drawerOpen} onClose={() => setDrawerOpen(false)}
          colors={colors} themeMode={themeMode} toggleTheme={toggleTheme}
          entryCount={0} onClearAll={handleClearAll} onAddTrip={handleAddTrip}
        />
      </SafeAreaView>
    );
  }

  const ListHeader = (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Journal</Text>
        <View style={[styles.countPill, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.countPillText, { color: colors.primary }]}>{entries.length}</Text>
        </View>
      </View>
      <FeaturedCard entry={featured!} onRemove={removeEntry} onPress={openDetail} colors={colors} />
      {rest.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All Entries</Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      {Header}

      <FlatList
        data={rest}
        keyExtractor={keyExtractor}
        renderItem={renderRow}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      />

      <DrawerMenu
        visible={drawerOpen} onClose={() => setDrawerOpen(false)}
        colors={colors} themeMode={themeMode} toggleTheme={toggleTheme}
        entryCount={entries.length} onClearAll={handleClearAll} onAddTrip={handleAddTrip}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;