import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Platform, Alert, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:  true,
    shouldPlaySound:  false,
    shouldSetBadge:   false,
    shouldShowBanner: true,
    shouldShowList:   true,
  }),
});

export default function NotificationScreen() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hello!',
        body:  'This is a local push notification.',
        sound: 'default',
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
}

// ─── Exported Helpers ──── //
export const registerForPushNotificationsAsync =
  async (): Promise<string | undefined> => {
    let token: string | undefined;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('travel-diary', {
        name:             'Travel Diary',
        importance:       Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor:       '#FF231F7C',
      });
    }

    // Must be a physical device
    if (!Device.isDevice) {
      alert('Must use a physical device for push notifications');
      return;
    }

    // Check current permission status first
    const { granted: existingPermission, canAskAgain } =
      await Notifications.getPermissionsAsync();

    if (existingPermission) {
    } else if (canAskAgain) {
      const { granted: newPermission } =
        await Notifications.requestPermissionsAsync();

      if (!newPermission) {
        Alert.alert(
          'Notification Permission Denied',
          'You will not receive confirmation when your travel entries are saved.',
          [{ text: 'OK' }]
        );
        return;
      }
    } else {
      // Permanently denied — guide to Settings
      Alert.alert(
        'Notification Permission Required',
        'WANDR needs notification permission to confirm when your travel entries are saved.\n\nPlease go to Settings → Notifications and enable notifications for this app.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    // Get push token
    if (!Constants.expoConfig?.extra?.eas?.projectId) {
      alert('Project ID not found in Expo config.');
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;

    console.log('Expo Push Token:', token);
    return token;
  };

/* Fire a local notification after a travel entry is saved. */
export const sendTravelEntrySavedNotification = async (
  address: string
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✈️ Travel Entry Saved!',
      body:  `Your travel memory at "${address}" has been saved to your diary.`,
      sound: 'default',
    },
    trigger: null,
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});