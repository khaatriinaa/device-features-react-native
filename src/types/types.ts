export interface TravelEntry {
  id: string;
  imageUri: string;          // primary image (cover) — kept for back-compat
  imageUris: string[];       // all images including cover
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  title?: string;
  notes?: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string; surface: string; card: string;
  text: string; textSecondary: string; primary: string;
  primaryLight: string; border: string; danger: string;
  placeholder: string; tabBar: string; tabBarBorder: string;
  shadow: string; inputBackground: string;
}

export interface DiaryContextType {
  entries: TravelEntry[];
  addEntry: (entry: TravelEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  loadEntries: () => Promise<void>;
}

export interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  colors: ThemeColors;
}

export interface AddEntryFormValues {
  title: string;
  notes: string;
}