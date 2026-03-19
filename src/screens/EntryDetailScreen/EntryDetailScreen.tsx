import React, { useState, useRef } from 'react';
import {
  View, Text, Image, Pressable, StyleSheet,
  Alert, StatusBar, Dimensions, FlatList, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

  const [expanded,  setExpanded ] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const allImages = entry.imageUris?.length ? entry.imageUris : [entry.imageUri];

  const parts   = entry.address.split(',').map((s) => s.trim()).filter(Boolean);
  const city    = parts[1] || parts[0] || entry.address;
  const country = parts[parts.length - 2] || '';
  const tag     = (parts[2] || parts[1] || 'TRAVEL').toUpperCase().slice(0, 22);

  // Formatted date
  const createdDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  const createdTime = new Date(entry.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

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

  // Parallax: image moves at 0.4x scroll speed
  const heroTranslateY = scrollY.interpolate({
    inputRange: [-HERO_HEIGHT, 0, HERO_HEIGHT],
    outputRange: [HERO_HEIGHT * 0.4, 0, -HERO_HEIGHT * 0.4],
    extrapolate: 'clamp',
  });
  const heroScale = scrollY.interpolate({
    inputRange: [-HERO_HEIGHT, 0],
    outputRange: [1.3, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── FIXED HERO (position:absolute, behind scroll) ── */}
      <View style={[styles.heroWrap, { height: HERO_HEIGHT }]}>
        <Animated.Image
          source={{ uri: allImages[heroIndex] }}
          style={[styles.heroImage, { transform: [{ translateY: heroTranslateY }, { scale: heroScale }] }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.1)']}
          style={StyleSheet.absoluteFillObject}
        />
        {allImages.length > 1 && (
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeText}>{heroIndex + 1}/{allImages.length}</Text>
          </View>
        )}
      </View>

      {/*
        ── HERO BUTTONS — rendered OUTSIDE heroWrap and ABOVE the ScrollView
           so they are never blocked by the scroll container's touch area.
           zIndex: 10 ensures they sit on top of everything.
      */}
      <SafeAreaView
        style={[styles.heroButtons, { zIndex: 10 }]}
        edges={['top']}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.heroBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.heroBtnText}>‹</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          style={[styles.heroBtn, { backgroundColor: 'rgba(239,68,68,0.75)' }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={{ fontSize: 16 }}>🗑</Text>
        </Pressable>
      </SafeAreaView>

      {/* ── SCROLLABLE SHEET (zIndex:1, above fixed hero) ── */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Transparent spacer — lets hero show through */}
        <View style={{ height: HERO_HEIGHT - SHEET_OVERLAP }} pointerEvents="none" />

        {/* Sheet content */}
        <View style={[styles.sheet, { backgroundColor: colors.surface, minHeight: 600 }]}>
          <View style={[styles.pullBar, { backgroundColor: colors.border }]} />

          {/* Photo strip */}
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

          <Text style={[styles.categoryTag, { color: colors.primary }]}>{tag}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{entry.title || 'Travel Memory'}</Text>
          <Text style={[styles.cityText, { color: colors.textSecondary }]}>
            {city}{country ? `, ${country}` : ''}
          </Text>

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

          {/*
            ── ENTRY INFO CARD (replaces useless "Traveler" row) ──────────
            Shows when the memory was recorded + photo count — actually useful.
          */}
          <View style={[styles.infoCard, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <View style={styles.infoCardRow}>
              <View style={styles.infoCardItem}>
                <Text style={[styles.infoCardLabel, { color: colors.placeholder }]}>RECORDED ON</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>{createdDate}</Text>
                <Text style={[styles.infoCardSub, { color: colors.textSecondary }]}>{createdTime}</Text>
              </View>
            </View>
            <View style={[styles.infoCardDivider, { backgroundColor: colors.border }]} />
            <View style={styles.infoCardRow}>
              <View style={styles.infoCardItem}>
                <Text style={[styles.infoCardLabel, { color: colors.placeholder }]}>PHOTOS</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>
                  {allImages.length} {allImages.length === 1 ? 'photo' : 'photos'}
                </Text>
              </View>
              <View style={[styles.infoCardVertDivider, { backgroundColor: colors.border }]} />
              <View style={styles.infoCardItem}>
                <Text style={[styles.infoCardLabel, { color: colors.placeholder }]}>ENTRY ID</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>#{entry.id.slice(-6)}</Text>
              </View>
            </View>
          </View>

          {/* About / notes */}
          <View style={styles.aboutSection}>
            <Text style={[styles.aboutTitle, { color: colors.text }]}>Notes</Text>
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

          {/* Delete button at bottom */}
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [
              styles.deleteFullBtn,
              { backgroundColor: pressed ? '#FEE2E2' : '#FEF2F2', borderColor: '#FECACA' },
            ]}
          >
            <Text style={{ fontSize: 16, marginRight: 6 }}>🗑</Text>
            <Text style={[styles.deleteFullBtnText, { color: colors.danger }]}>Delete this memory</Text>
          </Pressable>

          <View style={{ height: insets.bottom + 24 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default EntryDetailScreen;