import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  Pressable,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useTheme } from '../../context/ThemeContext';
import { useDiary } from '../../context/DiaryContext';
import ThemeToggle from '../../components/ThemeToggle';
import { requestLocationAndGetCoords, getAddressFromCoords } from '../../utils/Geolocation';
import { sendTravelEntrySavedNotification, registerForPushNotificationsAsync } from '../../utils/LocalPushNotification';
import { AddEntryFormValues, TravelEntry } from '../../types/types';
import { AddEntryScreenProps } from '../../types/props';
import styles from './AddEntryScreen.styles';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(60, 'Title must be at most 60 characters')
    .required('Title is required'),
  notes: Yup.string().max(300, 'Notes must be at most 300 characters'),
});

const initialValues: AddEntryFormValues = { title: '', notes: '' };

const AddEntryScreen: React.FC<AddEntryScreenProps> = ({ navigation }) => {
  const { colors, themeMode } = useTheme();
  const { addEntry } = useDiary();
  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);
  const notesInputRef = useRef<TextInput>(null);

  // Animated bottom padding that grows/shrinks with the keyboard
  const keyboardPadding = useRef(new Animated.Value(0)).current;

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Listen to keyboard show/hide and animate the bottom padding accordingly.
  // This is the most reliable approach on RN 0.76 / Expo 54 iOS — no KAV needed.
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', (e) => {
      // keyboardWillShow gives us the final keyboard frame before animation
      const keyboardHeight = e.endCoordinates.height;
      // Subtract the bottom safe area so we don't double-count it
      const offset = keyboardHeight - insets.bottom;
      Animated.timing(keyboardPadding, {
        toValue: offset,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener('keyboardWillHide', (e) => {
      Animated.timing(keyboardPadding, {
        toValue: 0,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom, keyboardPadding]);

  useFocusEffect(
    useCallback(() => {
      registerForPushNotificationsAsync();
      return () => {
        setImageUri(null);
        setAddress('');
        setLatitude(0);
        setLongitude(0);
      };
    }, [])
  );

  const takePicture = async (): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await fetchLocation();
    }
  };

  const fetchLocation = async (): Promise<void> => {
    setLoadingLocation(true);
    try {
      const { latitude: lat, longitude: lng } = await requestLocationAndGetCoords();
      setLatitude(lat);
      setLongitude(lng);
      const addr = await getAddressFromCoords(lat, lng);
      setAddress(addr);
    } catch (error: any) {
      Alert.alert('Location Error', error.message || 'Unable to get location.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSave = async (values: AddEntryFormValues, resetForm: () => void): Promise<void> => {
    if (!imageUri) { Alert.alert('No Photo', 'Please take a picture first.'); return; }
    if (!address) { Alert.alert('No Location', 'Location is still loading.'); return; }
    setSaving(true);
    try {
      const newEntry: TravelEntry = {
        id: Date.now().toString(),
        imageUri, address, latitude, longitude,
        createdAt: new Date().toISOString(),
        title: values.title,
        notes: values.notes,
      };
      await addEntry(newEntry);
      await sendTravelEntrySavedNotification(address);
      setImageUri(null); setAddress(''); setLatitude(0); setLongitude(0);
      resetForm();
      navigation.navigate('Home');
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Scroll the focused input into view above the keyboard
  const scrollToY = (y: number) => {
    setTimeout(() => scrollRef.current?.scrollTo({ y, animated: true }), 100);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Fixed header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>📸 New Entry</Text>
        <ThemeToggle size={40} />
      </View>

      {/*
        ✅ THE FIX:
        No KeyboardAvoidingView at all.
        Instead, an Animated.View wraps the ScrollView and its
        paddingBottom grows in sync with the keyboard animation.
        This is pixel-perfect on iOS because we use keyboardWillShow
        which fires before the keyboard appears (with the correct
        final height), and we match its animation duration exactly.
      */}
      <Animated.View style={[styles.kavContainer, { paddingBottom: keyboardPadding }]}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => handleSave(values, resetForm)}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
              <>
                {/* Camera Area */}
                <Pressable
                  onPress={takePicture}
                  style={({ pressed }) => [
                    styles.cameraArea,
                    {
                      backgroundColor: pressed ? colors.primaryLight : colors.surface,
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

                {imageUri && (
                  <Pressable onPress={takePicture} style={[styles.retakeButton, { borderColor: colors.primary }]}>
                    <Text style={[styles.retakeText, { color: colors.primary }]}>🔄 Retake Photo</Text>
                  </Pressable>
                )}

                {/* Address Box */}
                {(loadingLocation || address.length > 0) && (
                  <View style={[styles.addressBox, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
                    {loadingLocation ? (
                      <View style={styles.locationLoading}>
                        <ActivityIndicator color={colors.primary} size="small" />
                        <Text style={[styles.locationLoadingText, { color: colors.textSecondary }]}>
                          Getting your location…
                        </Text>
                      </View>
                    ) : (
                      <>
                        <Text style={[styles.addressLabel, { color: colors.primary }]}>📍 Location</Text>
                        <Text style={[styles.addressText, { color: colors.text }]}>{address}</Text>
                        <Text style={[styles.coordsText, { color: colors.textSecondary }]}>
                          {latitude.toFixed(5)}, {longitude.toFixed(5)}
                        </Text>
                      </>
                    )}
                  </View>
                )}

                {/* Form Fields */}
                <View style={styles.form}>
                  <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor: touched.title && errors.title ? colors.danger : colors.border,
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
                    onSubmitEditing={() => notesInputRef.current?.focus()}
                    onFocus={() => scrollToY(300)}
                  />
                  {touched.title && errors.title && (
                    <Text style={[styles.errorText, { color: colors.danger }]}>{errors.title}</Text>
                  )}

                  <Text style={[styles.label, { color: colors.text }]}>Notes (optional)</Text>
                  <TextInput
                    ref={notesInputRef}
                    style={[
                      styles.textArea,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor: touched.notes && errors.notes ? colors.danger : colors.border,
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
                    onFocus={() => scrollToY(420)}
                  />
                  {touched.notes && errors.notes && (
                    <Text style={[styles.errorText, { color: colors.danger }]}>{errors.notes}</Text>
                  )}

                  <Pressable
                    onPress={() => handleSubmit()}
                    disabled={saving || !isValid || !imageUri}
                    style={({ pressed }) => [
                      styles.saveButton,
                      {
                        backgroundColor:
                          saving || !isValid || !imageUri
                            ? colors.placeholder
                            : pressed ? '#3730A3' : colors.primary,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Save travel entry"
                  >
                    {saving
                      ? <ActivityIndicator color="#fff" />
                      : <Text style={styles.saveButtonText}>💾 Save Entry</Text>
                    }
                  </Pressable>
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AddEntryScreen;