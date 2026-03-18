import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // ✅ NEW: KeyboardAvoidingView needs its own flex:1 style
  kavContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
    gap: 12,
  },
  // ── Camera area ──────────────────────────────────────────────────────────
  cameraArea: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  cameraPlaceholder: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 32,
  },
  cameraEmoji: {
    fontSize: 52,
  },
  cameraText: {
    fontSize: 15,
    fontWeight: '500',
  },
  retakeButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 4,
  },
  retakeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // ── Address box ──────────────────────────────────────────────────────────
  addressBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationLoadingText: {
    fontSize: 14,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '500',
  },
  coordsText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  // ── Form ─────────────────────────────────────────────────────────────────
  form: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default styles;