import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, Image, ScrollView, Alert, Pressable,
  TextInput, ActivityIndicator, StatusBar,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useTheme } from '../../context/ThemeContext';
import { useDiary } from '../../context/DiaryContext';
import { requestLocationAndGetCoords, getAddressFromCoords } from '../../utils/Geolocation';
import { sendTravelEntrySavedNotification, registerForPushNotificationsAsync } from '../../utils/LocalPushNotification';
import { AddEntryFormValues } from '../../types/types';
import { AddEntryScreenProps } from '../../types/props';
import styles, { THUMB_SIZE } from './AddEntryScreen.styles';

const MAX_PHOTOS = 6;

const validationSchema = Yup.object().shape({
  title: Yup.string().min(2, 'Min 2 chars').max(60, 'Max 60 chars').required('Title is required'),
  notes: Yup.string().max(300, 'Max 300 chars'),
});

const initialValues: AddEntryFormValues = { title: '', notes: '' };

const AddEntryScreen: React.FC<AddEntryScreenProps> = ({ navigation }) => {
  const { colors, themeMode } = useTheme();
  const { addEntry } = useDiary();
  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);
  const notesRef  = useRef<TextInput>(null);

  const titleYRef = useRef<number>(0);
  const notesYRef = useRef<number>(0);

  const [imageUris, setImageUris]             = useState<string[]>([]);
  const [address,   setAddress]               = useState('');
  const [latitude,  setLatitude]              = useState(0);
  const [longitude, setLongitude]             = useState(0);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving]                   = useState(false);

  const coverUri  = imageUris[0] ?? null;
  const extraUris = imageUris.slice(1);

  useFocusEffect(
    useCallback(() => {
      registerForPushNotificationsAsync();
      return () => {
        setImageUris([]);
        setAddress('');
        setLatitude(0);
        setLongitude(0);
      };
    }, [])
  );

  const scrollToY = (y: number) => {
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
  };

  const pickPhoto = async (isCover = false) => {
    if (!isCover && imageUris.length >= MAX_PHOTOS) {
      Alert.alert('Max photos', `You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }
    Alert.alert('Add Photo', 'Choose source', [
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission Required', 'Camera permission needed.'); return; }
          const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.85 });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUris((prev) => isCover ? [uri, ...prev.slice(1)] : [...prev, uri]);
            if (imageUris.length === 0) fetchLocation();
          }
        },
      },
      {
        text: 'Photo Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission Required', 'Library permission needed.'); return; }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.85,
          });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUris((prev) => isCover ? [uri, ...prev.slice(1)] : [...prev, uri]);
            if (imageUris.length === 0) fetchLocation();
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removePhoto = (index: number) =>
    setImageUris((prev) => prev.filter((_, i) => i !== index));

  const fetchLocation = async () => {
    setLoadingLocation(true);
    try {
      const { latitude: lat, longitude: lng } = await requestLocationAndGetCoords();
      setLatitude(lat); setLongitude(lng);
      setAddress(await getAddressFromCoords(lat, lng));
    } catch (e: any) {
      Alert.alert('Location Error', e.message || 'Unable to get location.');
    } finally { setLoadingLocation(false); }
  };

  const handleSave = async (values: AddEntryFormValues, resetForm: () => void) => {
    if (!coverUri) { Alert.alert('No Photo', 'Please add a cover photo first.'); return; }
    if (!address)  { Alert.alert('No Location', 'Location is still loading.'); return; }
    setSaving(true);
    try {
      await addEntry({
        id: Date.now().toString(),
        imageUri: coverUri,
        imageUris,
        address, latitude, longitude,
        createdAt: new Date().toISOString(),
        title: values.title,
        notes: values.notes,
      });
      await sendTravelEntrySavedNotification(address);
      setImageUris([]); setAddress(''); setLatitude(0); setLongitude(0);
      resetForm();
      navigation.navigate('Home');
    } catch { Alert.alert('Error', 'Failed to save. Try again.'); }
    finally { setSaving(false); }
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

      {/* Header — fixed, never moves */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={[styles.backBtn, { backgroundColor: colors.inputBackground }]}
        >
          <Text style={[styles.backBtnText, { color: colors.text }]}>‹</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add New Entry</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => handleSave(values, resetForm)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
          <>
            {/*
              KAV wraps ONLY the ScrollView — not the bottom bar.
              This means:
                - Keyboard open → KAV shrinks the scroll area only
                - The focused field scrolls into view via onFocus → scrollToY
                - Save button stays pinned at the bottom, never moves, no gap
            */}
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
            >
              <ScrollView
                ref={scrollRef}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 12 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
              >
                {/* Cover photo */}
                <Pressable
                  onPress={() => pickPhoto(true)}
                  style={[
                    styles.coverArea,
                    { borderColor: colors.border, backgroundColor: colors.inputBackground },
                  ]}
                >
                  {coverUri ? (
                    <Image source={{ uri: coverUri }} style={styles.coverImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.coverPlaceholder}>
                      <Text style={styles.coverIcon}>📷</Text>
                      <Text style={[styles.coverText, { color: colors.placeholder }]}>
                        Add cover photo (tap here)
                      </Text>
                    </View>
                  )}
                </Pressable>

                {/* Extra photos row */}
                <View style={styles.photosRow}>
                  {imageUris.length < MAX_PHOTOS && (
                    <Pressable
                      onPress={() => pickPhoto(false)}
                      style={[
                        styles.addPhotoTile,
                        { borderColor: colors.border, backgroundColor: colors.inputBackground },
                      ]}
                    >
                      <Text style={[styles.addPhotoPlus, { color: colors.placeholder }]}>+</Text>
                    </Pressable>
                  )}
                  {extraUris.map((uri, idx) => (
                    <View key={uri} style={styles.thumbTile}>
                      <Image source={{ uri }} style={styles.thumbImage} resizeMode="cover" />
                      <Pressable onPress={() => removePhoto(idx + 1)} style={styles.thumbRemove} hitSlop={4}>
                        <Text style={styles.thumbRemoveText}>✕</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>

                {/* Title */}
                <View
                  style={styles.fieldGroup}
                  onLayout={(e) => { titleYRef.current = e.nativeEvent.layout.y; }}
                >
                  <Text style={[styles.sectionLabel, { color: colors.text }]}>Add Title</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                    placeholder="Enter a descriptive title for your adventure…"
                    placeholderTextColor={colors.placeholder}
                    value={values.title}
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    maxLength={60}
                    returnKeyType="next"
                    onFocus={() => scrollToY(titleYRef.current)}
                    onSubmitEditing={() => notesRef.current?.focus()}
                  />
                  {touched.title && errors.title && (
                    <Text style={[styles.errorText, { color: colors.danger }]}>{errors.title}</Text>
                  )}
                </View>

                {/* Notes */}
                <View
                  style={styles.fieldGroup}
                  onLayout={(e) => { notesYRef.current = e.nativeEvent.layout.y; }}
                >
                  <Text style={[styles.sectionLabel, { color: colors.text }]}>Add Notes</Text>
                  <TextInput
                    ref={notesRef}
                    style={[styles.textArea, { backgroundColor: colors.inputBackground, color: colors.text }]}
                    placeholder="Write your thoughts and experiences here…"
                    placeholderTextColor={colors.placeholder}
                    value={values.notes}
                    onChangeText={handleChange('notes')}
                    onBlur={handleBlur('notes')}
                    multiline
                    maxLength={300}
                    textAlignVertical="top"
                    scrollEnabled={false}
                    onFocus={() => scrollToY(notesYRef.current)}
                  />
                  {touched.notes && errors.notes && (
                    <Text style={[styles.errorText, { color: colors.danger }]}>{errors.notes}</Text>
                  )}
                </View>

                {/* Location */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.sectionLabel, { color: colors.text }]}>
                    Location{' '}
                    <Text style={{ fontWeight: '400', fontSize: 14, color: colors.textSecondary }}>
                      (auto-detected)
                    </Text>
                  </Text>
                  <View style={[styles.locationBox, { backgroundColor: colors.inputBackground }]}>
                    {loadingLocation ? (
                      <View style={styles.locationLoadingRow}>
                        <ActivityIndicator color={colors.primary} size="small" />
                        <Text style={[styles.locationText, { color: colors.placeholder }]}>
                          Getting your location…
                        </Text>
                      </View>
                    ) : address ? (
                      <View style={{ flex: 1, gap: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                          <Text style={styles.locationIcon}>📍</Text>
                          <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={2}>
                            {address}
                          </Text>
                        </View>
                        <Text style={[styles.locationCoords, { color: colors.placeholder }]}>
                          {latitude.toFixed(5)}°N, {longitude.toFixed(5)}°E
                        </Text>
                      </View>
                    ) : (
                      <>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={[styles.locationText, { color: colors.placeholder }]}>
                          Add a cover photo to detect location
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>

            {/*
              Bottom bar — OUTSIDE KAV.
              Always pinned at the screen bottom. Never shifts. No gap.
              insets.bottom handles the home indicator on iPhone.
            */}
            <View
              style={[
                styles.bottomBar,
                {
                  backgroundColor: colors.background,
                  borderTopColor: colors.border,
                  paddingBottom: insets.bottom,
                },
              ]}
            >
              <View style={[styles.authorAvatar, { backgroundColor: colors.primaryLight }]}>
                <Text style={styles.authorAvatarText}>🧳</Text>
              </View>
              <Text style={[styles.authorLabel, { color: colors.textSecondary }]}>Traveler</Text>
              <Pressable
                onPress={() => handleSubmit()}
                disabled={saving || !isValid || !coverUri}
                style={({ pressed }) => [
                  styles.saveBtn,
                  {
                    backgroundColor:
                      saving || !isValid || !coverUri
                        ? colors.placeholder
                        : pressed ? '#C94E20' : colors.primary,
                    shadowColor: colors.primary,
                  },
                ]}
              >
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.saveBtnText}>Save</Text>
                }
              </Pressable>
            </View>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default AddEntryScreen;