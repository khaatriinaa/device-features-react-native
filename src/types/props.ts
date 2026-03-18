import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TravelEntry } from './types';

export type TabParamList = {
  Home: undefined;
  AddEntry: undefined;
};

export type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;
export interface HomeScreenProps { navigation: HomeScreenNavigationProp; }

export type AddEntryScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'AddEntry'>;
export interface AddEntryScreenProps { navigation: AddEntryScreenNavigationProp; }

export interface EntryCardProps { entry: TravelEntry; onRemove: (id: string) => void; }
export interface ThemeToggleProps { size?: number; }
export interface EmptyStateProps { message?: string; }
export interface LoadingSpinnerProps { message?: string; }
