import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { DiaryProvider } from './src/context/DiaryContext';
import AppNavigator from './src/navigation/AppNavigator';

// Inner component so it can access useTheme() after ThemeProvider mounts
const AppContent: React.FC = () => {
  const { themeMode, colors } = useTheme();

  // Build a NavigationContainer theme that matches our custom colors.
  // This prevents React Navigation from rendering its own light/dark
  // defaults on the tab bar, header, and background surfaces.
  const navTheme = themeMode === 'dark'
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background:   colors.background,
          card:         colors.tabBar,       // tab bar + header background
          border:       colors.tabBarBorder, // tab bar top border
          text:         colors.text,
          primary:      colors.primary,
          notification: colors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background:   colors.background,
          card:         colors.tabBar,
          border:       colors.tabBarBorder,
          text:         colors.text,
          primary:      colors.primary,
          notification: colors.primary,
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DiaryProvider>
          <AppContent />
        </DiaryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}