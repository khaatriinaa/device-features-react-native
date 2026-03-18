import React, { useState, useRef } from 'react';
import {
  View, Text, Image, ScrollView, Pressable,
  Alert, StatusBar, Dimensions, FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDiary } from '../../context/DiaryContext';
import { useTheme } from '../../context/ThemeContext';
import { EntryDetailScreenProps } from '../../types/props';
import styles, { HERO_HEIGHT, SHEET_OVERLAP } from './EntryDetailScreen.styles';

const { width: SCREEN_W } = Dimensions.get('window');

const EntryDetailScreen: React.FC<EntryDetailScreenProps> = ({ navigation, route }) => {
  const { entry } = route.params;
  const { removeEntry } = useDiary();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [bookmarked, setBookmarked] = useState(false);
  const [expanded,   setExpanded  ] = useState(false);
  const [heroIndex,  setHeroIndex ] = useState(0);  // which image is shown as hero

  // All images (support old entries that only have imageUri)
  const allImages = entry.imageUris?.length ? entry.imageUris : [entry.imageUri];

  // Address parsing
  const parts   = entry.address.split(',').map((s) => s.trim()).filter(Boolean);
  const city    = parts[1] || parts[0] || entry.address;
  const country = parts[parts.length - 2] || '';
  const tag     = (parts[2] || parts[1] || 'TRAVEL').toUpperCase().slice(0, 22);

  // Time ago
  const timeAgo = (() => {
    const diff = Date.now() - new Date(entry.createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hrs  > 0) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    if (mins > 0) return `${mins} min ago`;
    return 'Just now';
  })();

  const handleDelete = () => {
    Alert.alert('Delete Entry', 'Remove this travel memory?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => { await removeEntry(entry.id); navigation.goBack(); },
      },
    ]);
  };

  const noteText    = entry.notes || 'No notes were added for this travel memory.';
  const isLong      = noteText.length > 180;
  const displayText = isLong && !expanded ? noteText.slice(0, 180) + '…' : noteText;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* ── Hero image ── */}
        <View style={[styles.heroWrap, { height: HERO_HEIGHT }]}>
          <Image
            source={{ uri: allImages[heroIndex] }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Photo count badge */}
          {allImages.length > 1 && (
            <View style={styles.photoBadge}>
              <Text style={styles.photoBadgeText}>{heroIndex + 1}/{allImages.length}</Text>
            </View>
          )}

          {/* Back + bookmark */}
          <SafeAreaView style={styles.heroButtons} edges={['top']}>
            <Pressable onPress={() => navigation.goBack()} style={styles.heroBtn} hitSlop={8}>
              <Text style={styles.heroBtnText}>‹</Text>
            </Pressable>
            <Pressable onPress={() => setBookmarked((b) => !b)} style={styles.heroBtn} hitSlop={8}>
              <Text style={styles.heroBtnText}>{bookmarked ? '🔖' : '🏷️'}</Text>
            </Pressable>
          </SafeAreaView>
        </View>

        {/* ── White sheet ── */}
        <View style={[styles.sheet, { backgroundColor: colors.surface, marginTop: -SHEET_OVERLAP }]}>
          <View style={[styles.pullBar, { backgroundColor: colors.border }]} />

          {/* Photo strip — shown only if multiple images */}
          {allImages.length > 1 && (
            <FlatList
              data={allImages}
              keyExtractor={(uri, i) => `${uri}-${i}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stripContent}
              style={styles.photoStrip}
              renderItem={({ item, index }) => (
                <Pressable onPress={() => setHeroIndex(index)}>
                  <Image
                    source={{ uri: item }}
                    style={[
                      styles.stripThumb,
                      heroIndex === index && { borderColor: colors.primary, borderWidth: 2.5 },
                    ]}
                    resizeMode="cover"
                  />
                </Pressable>
              )}
            />
          )}

          {/* Category tag */}
          <Text style={[styles.categoryTag, { color: colors.primary }]}>{tag}</Text>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {entry.title || 'Travel Memory'}
          </Text>

          {/* City */}
          <Text style={[styles.cityText, { color: colors.textSecondary }]}>
            {city}{country ? `, ${country}` : ''}
          </Text>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaIcon, { color: colors.placeholder }]}>🕐</Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{timeAgo}</Text>
            </View>
            <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
            <View style={styles.metaItem}>
              <Text style={[styles.metaIcon, { color: colors.placeholder }]}>📍</Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {entry.latitude.toFixed(3)}°, {entry.longitude.toFixed(3)}°
              </Text>
            </View>
          </View>

          {/* Author row */}
          <View style={[styles.authorRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.avatarEmoji}>🧳</Text>
            </View>
            <Text style={[styles.authorName, { color: colors.text }]}>Traveler</Text>
            <Pressable onPress={handleDelete} style={[styles.deleteBtn, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.deleteBtnText, { color: colors.danger }]}>🗑 Delete</Text>
            </Pressable>
          </View>

          {/* About location */}
          <View style={styles.aboutSection}>
            <Text style={[styles.aboutTitle, { color: colors.text }]}>About location</Text>
            <Text style={[styles.aboutBody, { color: colors.textSecondary }]}>
              {displayText}
              {isLong && !expanded && (
                <Text style={[styles.readMore, { color: colors.primary }]} onPress={() => setExpanded(true)}>
                  {' '}Read More
                </Text>
              )}
            </Text>
          </View>

          {/* Address block */}
          <View style={[styles.addressBlock, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Text style={[styles.addressBlockLabel, { color: colors.primary }]}>📍 Full Address</Text>
            <Text style={[styles.addressBlockText, { color: colors.text }]}>{entry.address}</Text>
            <Text style={[styles.addressCoords, { color: colors.placeholder }]}>
              {entry.latitude.toFixed(5)}° N,  {entry.longitude.toFixed(5)}° E
            </Text>
          </View>

          <View style={{ height: insets.bottom + 32 }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default EntryDetailScreen;