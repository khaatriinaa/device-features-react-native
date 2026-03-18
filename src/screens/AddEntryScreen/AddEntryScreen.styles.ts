import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
export const THUMB_SIZE = (SCREEN_W - 20 * 2 - 10 * 3) / 4;

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  backBtnText: { fontSize: 22, fontWeight: '300', lineHeight: 28 },
  headerTitle: {
    fontSize: 20, fontWeight: '800', letterSpacing: -0.3,
    flex: 1, textAlign: 'center',
  },
  headerSpacer: { width: 36 },

  // ── Scroll body ────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 20,
  },

  // ── Cover photo ────────────────────────────────────────────────────────────
  coverArea: {
    height: 190,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  coverImage: { width: '100%', height: '100%' },
  coverPlaceholder: { alignItems: 'center', gap: 10 },
  coverIcon: { fontSize: 34, opacity: 0.35 },
  coverText: { fontSize: 14, fontWeight: '500' },

  // ── Extra photos row ───────────────────────────────────────────────────────
  photosRow: { flexDirection: 'row', gap: 10 },
  addPhotoTile: {
    width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: 14,
    borderWidth: 1.5, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  addPhotoPlus: { fontSize: 22, fontWeight: '300' },
  thumbTile: { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: 14, overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%' },
  thumbRemove: {
    position: 'absolute', top: 4, right: 4,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  thumbRemoveText: { color: '#fff', fontSize: 10, fontWeight: '700', lineHeight: 12 },

  // ── Fields ─────────────────────────────────────────────────────────────────
  fieldGroup: { gap: 8 },
  sectionLabel: { fontSize: 15, fontWeight: '800', letterSpacing: -0.1 },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 14,
  },
  textArea: {
    borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 14, minHeight: 100, textAlignVertical: 'top',
  },
  errorText: { fontSize: 12, marginLeft: 4 },

  // ── Location box ───────────────────────────────────────────────────────────
  locationBox: {
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  locationIcon: { fontSize: 16 },
  locationText: { fontSize: 14, flex: 1 },
  locationLoadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  locationCoords: { fontSize: 11, fontFamily: 'monospace', marginTop: 2 },

  // ── Bottom bar — NOT position:absolute, sits in normal flow inside KAV ───
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  authorAvatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  authorAvatarText: { fontSize: 18 },
  authorLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  saveBtn: {
    paddingHorizontal: 32, paddingVertical: 13,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
});

export default styles;