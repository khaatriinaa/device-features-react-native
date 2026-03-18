import { ThemeColors } from '../types/types';

export const lightColors: ThemeColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  border: '#E5E7EB',
  danger: '#EF4444',
  placeholder: '#9CA3AF',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  shadow: 'rgba(0,0,0,0.1)',
  inputBackground: '#F9FAFB',
};

export const darkColors: ThemeColors = {
  background: '#0F0F1A',
  surface: '#1A1A2E',
  card: '#1E1E35',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  primary: '#818CF8',
  primaryLight: '#1E1B4B',
  border: '#374151',
  danger: '#F87171',
  placeholder: '#6B7280',
  tabBar: '#1A1A2E',
  tabBarBorder: '#374151',
  shadow: 'rgba(0,0,0,0.4)',
  inputBackground: '#111827',
};

// Re-exported from AsyncStorage.tsx so the rest of the app can import from here
export { STORAGE_KEY, THEME_STORAGE_KEY } from '../utils/AsyncStorage';
