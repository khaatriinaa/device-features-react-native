import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { EntryCardProps } from '../types/props';

const EntryCard: React.FC<EntryCardProps> = ({ entry, onRemove, onPress }) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn  = () => Animated.spring(scaleAnim, { toValue: 0.975, useNativeDriver: true, speed: 30, bounciness: 2 }).start();
  const pressOut = () => Animated.spring(scaleAnim, { toValue: 1,     useNativeDriver: true, speed: 30, bounciness: 4 }).start();

  const confirmRemove = () =>
    Alert.alert('Delete Entry', 'Remove this travel memory?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onRemove(entry.id) },
    ]);

  const date  = new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const parts = entry.address.split(',').map((s) => s.trim()).filter(Boolean);
  const city  = parts[1] || parts[0] || entry.address;
  const country = parts[parts.length - 2] || '';
  const tag   = (parts[2] || parts[1] || 'TRAVEL').toUpperCase().slice(0, 20);

  // Photo count
  const photoCount = entry.imageUris?.length ?? 1;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={() => onPress?.(entry)}
        onLongPress={confirmRemove}
        delayLongPress={450}
        style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
        accessibilityRole="button"
        accessibilityHint="Tap to view, long press to delete"
      >
        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: entry.imageUri }} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={StyleSheet.absoluteFill} />

          {/* Date pill */}
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>{date}</Text>
          </View>

          {/* Photo count badge — only if more than 1 */}
          {photoCount > 1 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>📷 {photoCount}</Text>
            </View>
          )}

          {/* Delete */}
          <Pressable onPress={confirmRemove} style={styles.deletePill} hitSlop={8}>
            <Text style={styles.deletePillText}>🗑</Text>
          </Pressable>
        </View>

        {/* Sheet */}
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <Text style={[styles.tag, { color: colors.primary }]}>{tag}</Text>
          {entry.title ? (
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{entry.title}</Text>
          ) : null}
          <Text style={[styles.city, { color: colors.textSecondary }]} numberOfLines={1}>
            {city}{country ? `, ${country}` : ''}
          </Text>

          <View style={styles.metaRow}>
            <View style={[styles.chip, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.chipText, { color: colors.primary }]}>
                📍 {entry.latitude.toFixed(3)}°, {entry.longitude.toFixed(3)}°
              </Text>
            </View>
            <View style={{ flex: 1 }} />
            <Text style={[styles.tapHint, { color: colors.placeholder }]}>tap to view</Text>
          </View>

          {entry.notes ? (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.notes, { color: colors.textSecondary }]} numberOfLines={2}>
                {entry.notes}
              </Text>
            </>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16, marginVertical: 10,
    borderRadius: 20, overflow: 'hidden',
    elevation: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16,
  },
  heroWrap: { width: '100%', height: 210 },
  heroImage: { width: '100%', height: '100%' },
  datePill: {
    position: 'absolute', top: 14, left: 14,
    backgroundColor: 'rgba(0,0,0,0.42)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  datePillText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  countBadge: {
    position: 'absolute', bottom: 14, left: 14,
    backgroundColor: 'rgba(0,0,0,0.42)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  countBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  deletePill: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: 'rgba(0,0,0,0.42)',
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  deletePillText: { fontSize: 15 },
  sheet: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 5 },
  tag: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4, lineHeight: 26, marginTop: 2 },
  city: { fontSize: 13, fontWeight: '500', marginTop: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  chip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  chipText: { fontSize: 11, fontWeight: '700' },
  tapHint: { fontSize: 10, fontStyle: 'italic' },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 10 },
  notes: { fontSize: 13, lineHeight: 20 },
});

export default EntryCard;