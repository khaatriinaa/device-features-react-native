import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const HERO_HEIGHT  = SCREEN_H * 0.42;
export const SHEET_OVERLAP = 28;

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroWrap: { width: SCREEN_W, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  photoBadge: {
    position: 'absolute',
    bottom: SHEET_OVERLAP + 12,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  photoBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  heroButtons: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  heroBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBtnText: { color: '#fff', fontSize: 20, fontWeight: '600', lineHeight: 26 },

  // ── Sheet ─────────────────────────────────────────────────────────────────
  sheet: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  pullBar: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginBottom: 14,
  },

  // ── Photo strip ───────────────────────────────────────────────────────────
  photoStrip: { marginBottom: 16 },
  stripContent: { gap: 8, paddingRight: 4 },
  stripThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  // ── Content ───────────────────────────────────────────────────────────────
  categoryTag: {
    fontSize: 11, fontWeight: '800',
    letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 6,
  },
  title: {
    fontSize: 26, fontWeight: '900',
    letterSpacing: -0.5, lineHeight: 32, marginBottom: 4,
  },
  cityText: { fontSize: 14, fontWeight: '500', marginBottom: 14 },

  // ── Meta row ──────────────────────────────────────────────────────────────
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaIcon: { fontSize: 13 },
  metaText: { fontSize: 12, fontWeight: '500' },
  metaDot: { width: 4, height: 4, borderRadius: 2 },

  // ── Author ────────────────────────────────────────────────────────────────
  authorRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 22, gap: 12,
  },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 22 },
  authorName: { flex: 1, fontSize: 15, fontWeight: '700' },
  deleteBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  deleteBtnText: { fontSize: 13, fontWeight: '700' },

  // ── About ─────────────────────────────────────────────────────────────────
  aboutSection: { marginBottom: 22 },
  aboutTitle: { fontSize: 17, fontWeight: '800', marginBottom: 10, letterSpacing: -0.2 },
  aboutBody: { fontSize: 14, lineHeight: 22, letterSpacing: 0.1 },
  readMore: { fontWeight: '700', fontSize: 14 },

  // ── Address block ─────────────────────────────────────────────────────────
  addressBlock: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 4, marginBottom: 8 },
  addressBlockLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  addressBlockText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  addressCoords: { fontSize: 11, fontFamily: 'monospace', marginTop: 2 },
});

export default styles;