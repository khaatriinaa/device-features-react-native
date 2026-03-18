import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { DiaryProvider } from './src/context/DiaryContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DiaryProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </DiaryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
