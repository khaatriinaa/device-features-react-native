import { ThemeColors } from '../types/types';

export const lightColors: ThemeColors = {
  background:      '#FFFFFF',
  surface:         '#FFFFFF',
  card:            '#FFFFFF',
  text:            '#1A1A1A',
  textSecondary:   '#6B7280',
  primary:         '#F4622A',
  primaryLight:    '#FEF0EB',
  border:          '#EFEFEF',
  danger:          '#EF4444',
  placeholder:     '#AAAAAA',
  tabBar:          '#FFFFFF',
  tabBarBorder:    '#EFEFEF',
  shadow:          'rgba(0,0,0,0.10)',
  inputBackground: '#F5F5F5',
};

export const darkColors: ThemeColors = {
  background:      '#111111',
  surface:         '#1C1C1C',
  card:            '#1C1C1C',
  text:            '#F5F5F5',
  textSecondary:   '#888888',
  primary:         '#F4622A',
  primaryLight:    '#2A1A12',
  border:          '#2A2A2A',
  danger:          '#F87171',
  placeholder:     '#555555',
  tabBar:          '#1C1C1C',
  tabBarBorder:    '#2A2A2A',
  shadow:          'rgba(0,0,0,0.50)',
  inputBackground: '#2A2A2A',
};

export { STORAGE_KEY, THEME_STORAGE_KEY } from '../utils/AsyncStorage';