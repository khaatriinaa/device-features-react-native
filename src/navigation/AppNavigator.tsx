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
  const { colors } = useTheme();
  return (
    <View style={tabStyles.container}>
      <Text style={[tabStyles.emoji, { opacity: focused ? 1 : 0.4 }]}>{emoji}</Text>
      <Text style={[tabStyles.label, { color: focused ? colors.primary : colors.placeholder }]}>
        {label}
      </Text>
    </View>
  );
};

// ── Bottom tab navigator ───────────────────────────────────────────────────────
const TabNavigator: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 10,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⌂" label="Home" focused={focused} /> }}
      />
      <Tab.Screen
        name="AddEntry"
        component={AddEntryScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="＋" label="Add" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
};

// ── Root stack — wraps tabs + detail screen ────────────────────────────────────
const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="EntryDetail"
        component={EntryDetailScreen}
        options={{
          // Slide up from bottom like a modal sheet
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
  emoji: { fontSize: 21 },
  label: { fontSize: 10, fontWeight: '600' },
});

export default AppNavigator;