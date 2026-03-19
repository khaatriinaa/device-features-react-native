import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { TabParamList, RootStackParamList } from '../types/props';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import AddEntryScreen from '../screens/AddEntryScreen/AddEntryScreen';
import EntryDetailScreen from '../screens/EntryDetailScreen/EntryDetailScreen';

const Tab   = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// ── Tab icon ──────────────────────────────────────────────────────────────────
const TabIcon: React.FC<{ emoji: string; label: string; focused: boolean }> = ({ emoji, label, focused }) => {
  const { colors, themeMode } = useTheme();
  // In dark mode: focused = orange, inactive = white
  // In light mode: focused = orange, inactive = gray
  const activeColor   = colors.primary;
  const inactiveColor = themeMode === 'dark' ? '#FFFFFF' : colors.placeholder;
  const iconColor     = focused ? activeColor : inactiveColor;

  return (
    <View style={tabStyles.container}>
      <Text style={[tabStyles.emoji, { color: iconColor }]}>{emoji}</Text>
      <Text style={[tabStyles.label, { color: iconColor }]}>{label}</Text>
    </View>
  );
};

// ── Bottom tab navigator ───────────────────────────────────────────────────────
const TabNavigator: React.FC = () => {
  const { colors, themeMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.placeholder,
        tabBarStyle: {
          // Explicit solid background — no transparency
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 10,
          // Elevation/shadow
          elevation: 8,
          shadowColor: themeMode === 'dark' ? '#000' : '#00000020',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: themeMode === 'dark' ? 0.6 : 0.08,
          shadowRadius: 8,
        },
        // CRITICAL: forces the navigator's internal background to match
        // instead of letting the OS render its own translucent bar
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: colors.tabBar,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.tabBarBorder,
            }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="⌂" label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="AddEntry"
        component={AddEntryScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="＋" label="Add" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

// ── Root stack ────────────────────────────────────────────────────────────────
const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="EntryDetail"
        component={EntryDetailScreen}
        options={{
          presentation: 'card',
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.height, 0],
                  }),
                },
              ],
            },
          }),
        }}
      />
    </Stack.Navigator>
  );
};

const tabStyles = StyleSheet.create({
  container: { alignItems: 'center', gap: 2 },
  emoji:     { fontSize: 21 },
  label:     { fontSize: 10, fontWeight: '600' },
});

export default AppNavigator;