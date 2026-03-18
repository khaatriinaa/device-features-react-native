import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggleProps } from '../types/props';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 36 }) => {
  const { themeMode, toggleTheme, colors } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}   // ← direct ref, no wrapper lambda
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? colors.primaryLight : colors.surface,
          borderColor: colors.border,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      accessibilityLabel={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
      accessibilityRole="button"
      hitSlop={8}              // ← larger tap target, prevents missed taps
    >
      <Text style={{ fontSize: size * 0.5 }}>
        {themeMode === 'light' ? '🌙' : '☀️'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default ThemeToggle;