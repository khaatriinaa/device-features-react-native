import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { EmptyStateProps } from '../types/props';

const EmptyState: React.FC<EmptyStateProps> = ({ message = 'No Entries yet' }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🗺️</Text>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Tap the 📸 tab below to add your first travel memory!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 },
  emoji: { fontSize: 64 },
  message: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  hint: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});

export default EmptyState;
