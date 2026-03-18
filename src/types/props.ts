import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TravelEntry } from './types';

// ── Bottom tab navigator ───────────────────────────────────────────────────
export type TabParamList = {
  Home: undefined;
  AddEntry: undefined;
};

export type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;
export interface HomeScreenProps { navigation: HomeScreenNavigationProp; }

export type AddEntryScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'AddEntry'>;
export interface AddEntryScreenProps { navigation: AddEntryScreenNavigationProp; }

// ── Root stack navigator (wraps the tab navigator) ─────────────────────────
export type RootStackParamList = {
  Main: undefined;
  EntryDetail: { entry: TravelEntry };
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

export type EntryDetailScreenRouteProp = RouteProp<RootStackParamList, 'EntryDetail'>;
export interface EntryDetailScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'EntryDetail'>;
  route: EntryDetailScreenRouteProp;
}

// ── Component props ────────────────────────────────────────────────────────
export interface EntryCardProps {
  entry: TravelEntry;
  onRemove: (id: string) => void;
  onPress?: (entry: TravelEntry) => void;
}
export interface ThemeToggleProps  { size?: number; }
export interface EmptyStateProps   { message?: string; }
export interface LoadingSpinnerProps { message?: string; }