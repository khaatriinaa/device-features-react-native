import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggleProps } from '../types/props';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 38 }) => {
  const { themeMode, toggleTheme, colors } = useTheme();
  return (
    <Pressable
      onPress={toggleTheme}
      hitSlop={8}
      style={({ pressed }) => [
        styles.btn,
        {
          width: size, height: size, borderRadius: size / 2,
          backgroundColor: pressed ? colors.primaryLight : colors.inputBackground,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
      accessibilityLabel={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
      accessibilityRole="button"
    >
      <Text style={{ fontSize: size * 0.44 }}>
        {themeMode === 'light' ? '🌙' : '☀️'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
});

export default ThemeToggle;