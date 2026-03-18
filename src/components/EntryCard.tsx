import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { EntryCardProps } from '../types/props';

const EntryCard: React.FC<EntryCardProps> = ({ entry, onRemove }) => {
  const { colors } = useTheme();

  const handleRemove = () => {
    Alert.alert('Remove Entry', 'Are you sure you want to delete this travel memory?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onRemove(entry.id) },
    ]);
  };

  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow, borderColor: colors.border }]}>
      <Image source={{ uri: entry.imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        {entry.title ? (
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {entry.title}
          </Text>
        ) : null}
        <View style={styles.locationRow}>
          <Text style={styles.pinEmoji}>📍</Text>
          <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={2}>
            {entry.address}
          </Text>
        </View>
        {entry.notes ? (
          <Text style={[styles.notes, { color: colors.textSecondary }]} numberOfLines={2}>
            {entry.notes}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={[styles.date, { color: colors.placeholder }]}>{formattedDate}</Text>
          <Pressable
            onPress={handleRemove}
            style={({ pressed }) => [styles.removeButton, { backgroundColor: pressed ? '#FCA5A5' : '#FEE2E2' }]}
            accessibilityLabel="Remove entry"
            accessibilityRole="button"
          >
            <Text style={[styles.removeButtonText, { color: colors.danger }]}>🗑️ Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 16, marginHorizontal: 16, marginVertical: 8, borderWidth: 1, overflow: 'hidden', elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  image: { width: '100%', height: 200 },
  content: { padding: 14, gap: 6 },
  title: { fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  pinEmoji: { fontSize: 14, marginTop: 1 },
  address: { fontSize: 13, flex: 1, lineHeight: 18 },
  notes: { fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  date: { fontSize: 12 },
  removeButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  removeButtonText: { fontSize: 13, fontWeight: '600' },
});

export default EntryCard;
