import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function GeolocationScreen() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [address, setAddress]   = useState<string>('');

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied.');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setLocation({
        latitude:  locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });
    } catch (error) {
      setErrorMsg('Error fetching location.');
      console.error(error);
    }
  };

  const getAddress = async () => {
    if (!location) return;
    const addressResult = await Location.reverseGeocodeAsync({
      latitude:  location.latitude,
      longitude: location.longitude,
    });
    setAddress(
      formatAddress(
        addressResult[0].name       ?? '',
        addressResult[0].city       ?? '',
        addressResult[0].region     ?? '',
        addressResult[0].postalCode ?? ''
      )
    );
  };

  function formatAddress(
    name:       string,
    city:       string,
    region:     string,
    postalCode: string
  ): string {
    return name + ', ' + city + ', ' + region + ' ' + postalCode;
  }

  return (
    <View style={styles.container}>
      <Button title="Get Current Location" onPress={getCurrentLocation} />
      <Button title="Get Address"          onPress={getAddress} />
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      {location && (
        <Text style={styles.text}>
          Latitude: {location.latitude} | Longitude: {location.longitude}
        </Text>
      )}
      {address && <Text style={styles.text}>{address}</Text>}
    </View>
  );
}

// ─── Exported Helpers (used by AddEntryScreen) ──── //
export const requestLocationAndGetCoords =
  async (): Promise<LocationCoords> => {
    // Check current status first
    const { status: currentStatus } =
      await Location.getForegroundPermissionsAsync();

    if (currentStatus === 'granted') {
      // Already granted — get coords directly
      return await getCurrentCoords();
    }

    if (currentStatus === 'undetermined') {
      // First time — show native dialog
      const { status: newStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (newStatus === 'granted') return await getCurrentCoords();

      throw new Error('Permission to access location was denied.');
    }

    // Previously denied — guide to Settings
    Alert.alert(
      'Location Permission Required',
      'WANDR needs location access to tag your travel entries.\n\nPlease go to Settings → Privacy → Location and enable access for this app.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
    throw new Error('Permission to access location was denied.');
  };

const getCurrentCoords = async (): Promise<LocationCoords> => {
  try {
    const locationData = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });
    return {
      latitude:  locationData.coords.latitude,
      longitude: locationData.coords.longitude,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching location.');
  }
};

/* Reverse geocode latitude/longitude to a human-readable address. */
export const getAddressFromCoords = async (
  latitude:  number,
  longitude: number
): Promise<string> => {
  try {
    const addressResult = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (addressResult.length > 0) {
      const r = addressResult[0];
      return formatAddressHelper(
        r.name       ?? '',
        r.city       ?? '',
        r.region     ?? '',
        r.postalCode ?? ''
      );
    }
    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  }
};

function formatAddressHelper(
  name:       string,
  city:       string,
  region:     string,
  postalCode: string
): string {
  return name + ', ' + city + ', ' + region + ' ' + postalCode;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});