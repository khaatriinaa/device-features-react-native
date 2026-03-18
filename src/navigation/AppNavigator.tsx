import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { TabParamList } from '../types/props';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import AddEntryScreen from '../screens/AddEntryScreen/AddEntryScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon: React.FC<{ emoji: string; label: string; focused: boolean }> = ({
  emoji, label, focused,
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabEmoji, focused && { transform: [{ scale: 1.15 }] }]}>
        {emoji}
      </Text>
      <Text style={[styles.tabLabel, { color: focused ? colors.primary : colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
};

const AppNavigator: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" label="Diary" focused={focused} /> }}
      />
      <Tab.Screen
        name="AddEntry"
        component={AddEntryScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📸" label="Add" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: { alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabEmoji: { fontSize: 22 },
  tabLabel: { fontSize: 10, fontWeight: '600' },
});

export default AppNavigator;
