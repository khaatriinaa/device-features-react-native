import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { EmptyStateProps } from '../types/props';

const EmptyState: React.FC<EmptyStateProps> = ({ message = 'No entries yet' }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: colors.primaryLight }]}>
        <Text style={styles.emoji}>🗺️</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{message}</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        Tap the <Text style={{ color: colors.primary, fontWeight: '700' }}>+</Text> tab below{'\n'}to add your first travel memory
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 14 },
  circle: { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emoji: { fontSize: 58 },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, textAlign: 'center' },
  sub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

export default EmptyState;