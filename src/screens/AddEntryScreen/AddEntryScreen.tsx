import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useTheme } from '../../context/ThemeContext';
import { useDiary } from '../../context/DiaryContext';
import ThemeToggle from '../../components/ThemeToggle';

// Utils — using the exact provided utility files
import { requestLocationAndGetCoords, getAddressFromCoords } from '../../utils/Geolocation';
import { sendTravelEntrySavedNotification, registerForPushNotificationsAsync } from '../../utils/LocalPushNotification';

import { AddEntryFormValues, TravelEntry } from '../../types/types';
import { AddEntryScreenProps } from '../../types/props';
import styles from './AddEntryScreen.styles';

// ─── Yup Validation Schema ─────────────────────────────────────────────────────
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(60, 'Title must be at most 60 characters')
    .required('Title is required'),
  notes: Yup.string()
    .max(300, 'Notes must be at most 300 characters'),
});

// ─── Initial Formik Values ─────────────────────────────────────────────────────
const initialValues: AddEntryFormValues = { title: '', notes: '' };

// ─── Component ─────────────────────────────────────────────────────────────────
const AddEntryScreen: React.FC<AddEntryScreenProps> = ({ navigation }) => {
  const { colors, themeMode } = useTheme();
  const { addEntry } = useDiary();

  // ── State (matching Camera.tsx pattern) ──────────────────────────────────
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Clear form every time screen comes into focus ────────────────────────
  useFocusEffect(
    useCallback(() => {
      // Register for push notifications on focus
      registerForPushNotificationsAsync();

      // Cleanup: clear state when leaving without saving
      return () => {
        setImageUri(null);
        setAddress('');
        setLatitude(0);
        setLongitude(0);
      };
    }, [])
  );

  // ── Take Picture (Camera.tsx pattern) ────────────────────────────────────
  const takePicture = async (): Promise<void> => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to take pictures.');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1, // Highest quality
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Store the image URI
      await fetchLocation();
    }
  };

  // ── Fetch Location (Geolocation.tsx pattern) ─────────────────────────────
  const fetchLocation = async (): Promise<void> => {
    setLoadingLocation(true);
    try {
      const { latitude: lat, longitude: lng } = await requestLocationAndGetCoords();
      setLatitude(lat);
      setLongitude(lng);
      const addr = await getAddressFromCoords(lat, lng);
      setAddress(addr);
    } catch (error: any) {
      Alert.alert(
        'Location Error',
        error.message || 'Unable to get your current location.'
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  // ── Save Entry ────────────────────────────────────────────────────────────
  const handleSave = async (
    values: AddEntryFormValues,
    resetForm: () => void
  ): Promise<void> => {
    if (!imageUri) {
      Alert.alert('No Photo', 'Please take a picture before saving.');
      return;
    }
    if (!address) {
      Alert.alert('No Location', 'Location is still loading. Please wait a moment.');
      return;
    }

    setSaving(true);
    try {
      const newEntry: TravelEntry = {
        id: Date.now().toString(),
        imageUri,
        address,
        latitude,
        longitude,
        createdAt: new Date().toISOString(),
        title: values.title,
        notes: values.notes,
      };

      await addEntry(newEntry);

      // Send local push notification (LocalPushNotification.tsx pattern)
      await sendTravelEntrySavedNotification(address);

      // Reset all state after saving
      setImageUri(null);
      setAddress('');
      setLatitude(0);
      setLongitude(0);
      resetForm();

      Alert.alert('✅ Saved!', 'Your travel memory has been added to your diary.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save your travel entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ── Header ── */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>📸 New Entry</Text>
        <ThemeToggle size={40} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            {/* ── Camera Area ── */}
            <Pressable
              onPress={takePicture}
              style={({ pressed }) => [
                styles.cameraArea,
                {
                  backgroundColor: pressed
                    ? colors.primaryLight
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.cameraPlaceholder}>
                  <Text style={styles.cameraEmoji}>📷</Text>
                  <Text style={[styles.cameraText, { color: colors.textSecondary }]}>
                    Tap to take a picture
                  </Text>
                </View>
              )}
            </Pressable>

            {/* ── Retake Button ── */}
            {imageUri && (
              <Pressable
                onPress={takePicture}
                style={[styles.retakeButton, { borderColor: colors.primary }]}
              >
                <Text style={[styles.retakeText, { color: colors.primary }]}>
                  🔄 Retake Photo
                </Text>
              </Pressable>
            )}

            {/* ── Address Display (auto-filled after picture) ── */}
            {(loadingLocation || address.length > 0) && (
              <View
                style={[
                  styles.addressBox,
                  {
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.border,
                  },
                ]}
              >
                {loadingLocation ? (
                  <View style={styles.locationLoading}>
                    <ActivityIndicator color={colors.primary} size="small" />
                    <Text
                      style={[
                        styles.locationLoadingText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Getting your location…
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={[styles.addressLabel, { color: colors.primary }]}>
                      📍 Location
                    </Text>
                    <Text style={[styles.addressText, { color: colors.text }]}>
                      {address}
                    </Text>
                    <Text
                      style={[styles.coordsText, { color: colors.textSecondary }]}
                    >
                      {latitude.toFixed(5)}, {longitude.toFixed(5)}
                    </Text>
                  </>
                )}
              </View>
            )}

            {/* ── Formik Form ── */}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => handleSave(values, resetForm)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <View style={styles.form}>

                  {/* Title */}
                  <Text style={[styles.label, { color: colors.text }]}>
                    Title *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor:
                          touched.title && errors.title
                            ? colors.danger
                            : colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="e.g. Sunset at Boracay"
                    placeholderTextColor={colors.placeholder}
                    value={values.title}
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    maxLength={60}
                    returnKeyType="next"
                  />
                  {touched.title && errors.title && (
                    <Text style={[styles.errorText, { color: colors.danger }]}>
                      {errors.title}
                    </Text>
                  )}

                  {/* Notes */}
                  <Text style={[styles.label, { color: colors.text }]}>
                    Notes (optional)
                  </Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor:
                          touched.notes && errors.notes
                            ? colors.danger
                            : colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="Describe your experience…"
                    placeholderTextColor={colors.placeholder}
                    value={values.notes}
                    onChangeText={handleChange('notes')}
                    onBlur={handleBlur('notes')}
                    multiline
                    numberOfLines={4}
                    maxLength={300}
                    textAlignVertical="top"
                  />
                  {touched.notes && errors.notes && (
                    <Text style={[styles.errorText, { color: colors.danger }]}>
                      {errors.notes}
                    </Text>
                  )}

                  {/* Save Button */}
                  <Pressable
                    onPress={() => handleSubmit()}
                    disabled={saving || !isValid || !imageUri}
                    style={({ pressed }) => [
                      styles.saveButton,
                      {
                        backgroundColor:
                          saving || !isValid || !imageUri
                            ? colors.placeholder
                            : pressed
                            ? '#3730A3'
                            : colors.primary,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Save travel entry"
                  >
                    {saving ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.saveButtonText}>💾 Save Entry</Text>
                    )}
                  </Pressable>

                </View>
              )}
            </Formik>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddEntryScreen;
