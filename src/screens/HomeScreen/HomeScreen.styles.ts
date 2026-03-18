import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLeft: { flex: 1 },
  hamburger: { padding: 4 },
  hamburgerLine: { width: 22, height: 2, borderRadius: 2, marginVertical: 3 },

  // Brand wordmark
  brandRow: { alignItems: 'center' },
  brandWord: { fontSize: 22, fontWeight: '900', letterSpacing: 3 },

  // ── Featured card (first entry shown large) ───────────────────────────────
  featuredWrap: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
  },
  featuredImage: { width: '100%', height: 220 },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  featuredSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 3,
    fontWeight: '500',
  },

  // ── Section header ────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  sectionCount: { fontSize: 12, fontWeight: '600' },

  // ── Row card (remaining entries) ──────────────────────────────────────────
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  rowThumb: { width: 88, height: 88 },
  rowContent: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 3 },
  rowCategory: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  rowTitle: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2, lineHeight: 20 },
  rowCity: { fontSize: 12, fontWeight: '500' },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  rowMetaText: { fontSize: 11 },

  // ── Empty & list ─────────────────────────────────────────────────────────
  listContent: { paddingBottom: 40 },
  emptyContainer: { flex: 1 },
});

export default styles;