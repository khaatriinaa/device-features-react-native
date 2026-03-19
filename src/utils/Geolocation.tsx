// npx expo install expo-location
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function GeolocationScreen() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');

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
        latitude: locationData.coords.latitude,
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
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setAddress(
      formatAddress(
        addressResult[0].name ?? '',
        addressResult[0].city ?? '',
        addressResult[0].region ?? '',
        addressResult[0].postalCode ?? ''
      )
    );
  };

  function formatAddress(
    name: string,
    city: string,
    region: string,
    postalCode: string
  ): string {
    return name + ', ' + city + ', ' + region + ' ' + postalCode;
  }

  return (
    <View style={styles.container}>
      <Button title="Get Current Location" onPress={getCurrentLocation} />
      <Button title="Get Address" onPress={getAddress} />
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      {location && (
        <Text style={styles.text}>
          Latitude: {location.latitude} | Longitude: {location.longitude}
        </Text>
      )}
      {address && <Text style={styles.text}>{address}</Text>}
    </View>
  );
}

// ─── Exported Helpers (used by AddEntryScreen) ────────────────────────────────

/**
 * Request location permissions and get current GPS coordinates.
 * Uses BestForNavigation accuracy for real-time, constantly moving use cases.
 */
export const requestLocationAndGetCoords = async (): Promise<LocationCoords> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied.');
  }
  try {
    const locationData = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation, // real-time, constantly moving
    });
    return {
      latitude: locationData.coords.latitude,
      longitude: locationData.coords.longitude,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching location.');
  }
};

/**
 * Reverse geocode latitude/longitude to a human-readable address.
 */
export const getAddressFromCoords = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const addressResult = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (addressResult.length > 0) {
      const r = addressResult[0];
      return formatAddressHelper(
        r.name ?? '',
        r.city ?? '',
        r.region ?? '',
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
  name: string,
  city: string,
  region: string,
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