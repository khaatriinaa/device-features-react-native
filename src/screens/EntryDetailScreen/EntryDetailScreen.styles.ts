import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const HERO_HEIGHT   = SCREEN_H * 0.44;
export const SHEET_OVERLAP = 32;

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Fixed hero — position absolute, behind everything ────────────────────
  heroWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  heroImage: {
    width: SCREEN_W,
    height: HERO_HEIGHT,
  },
  photoBadge: {
    position: 'absolute',
    bottom: SHEET_OVERLAP + 12,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  photoBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  // ── Hero buttons — position absolute, OUTSIDE scroll, zIndex:10 ──────────
  // Rendered as a sibling of ScrollView (not inside heroWrap) so they are
  // never blocked by the scroll container's touch area.
  heroButtons: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  heroBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBtnText: { color: '#fff', fontSize: 22, fontWeight: '600', lineHeight: 28 },

  // ── Scrollable area ───────────────────────────────────────────────────────
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: { flexGrow: 1 },

  // ── Sheet ─────────────────────────────────────────────────────────────────
  sheet: {
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
    width: 64, height: 64,
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

  // ── Entry info card (replaces "Traveler" row) ─────────────────────────────
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 22,
    overflow: 'hidden',
  },
  infoCardRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoCardItem: { flex: 1 },
  infoCardLabel: {
    fontSize: 9, fontWeight: '800',
    letterSpacing: 1.2, textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoCardValue: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
  infoCardSub: { fontSize: 12, marginTop: 2 },
  infoCardDivider: { height: StyleSheet.hairlineWidth, marginHorizontal: 0 },
  infoCardVertDivider: { width: StyleSheet.hairlineWidth, marginVertical: 2 },

  // ── About / notes ─────────────────────────────────────────────────────────
  aboutSection: { marginBottom: 22 },
  aboutTitle: { fontSize: 17, fontWeight: '800', marginBottom: 10, letterSpacing: -0.2 },
  aboutBody: { fontSize: 14, lineHeight: 22, letterSpacing: 0.1 },
  readMore: { fontWeight: '700', fontSize: 14 },

  // ── Address block ─────────────────────────────────────────────────────────
  addressBlock: {
    borderRadius: 16, borderWidth: 1,
    padding: 16, gap: 4, marginBottom: 16,
  },
  addressBlockLabel: {
    fontSize: 11, fontWeight: '800',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  addressBlockText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  addressCoords: { fontSize: 11, fontFamily: 'monospace', marginTop: 2 },

  // ── Delete button at bottom ───────────────────────────────────────────────
  deleteFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  deleteFullBtnText: {
    fontSize: 15, fontWeight: '700',
  },
});

export default styles;