import React, { useState } from "react";
import { View, Button, Image, StyleSheet, Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CameraScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const takePicture = async () => {
    const permitted = await requestCameraPermission();
    if (!permitted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a Picture" onPress={takePicture} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
}

// ─── Exported Helper ──── //

export const requestCameraPermission = async (): Promise<boolean> => {
  // Check current status first — never ask blindly
  const { status: currentStatus } =
    await ImagePicker.getCameraPermissionsAsync();

  // Already granted — proceed immediately
  if (currentStatus === "granted") return true;

  // Not yet asked — show the native OS dialog
  if (currentStatus === "undetermined") {
    const { status: newStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (newStatus === "granted") return true;

    Alert.alert(
      "Camera Permission Denied",
      "Camera access was denied. You can enable it in Settings → Privacy → Camera.",
      [{ text: "OK" }]
    );
    return false;
  }

  Alert.alert(
    "Camera Permission Required",
    "WANDR needs camera access to capture your travel photos.\n\nPlease go to Settings → Privacy → Camera and enable access for this app.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Open Settings", onPress: () => Linking.openSettings() },
    ]
  );
  return false;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});