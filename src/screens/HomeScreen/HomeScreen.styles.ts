import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerIconBtn: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    gap: 4,
  },
  hamburgerLine: {
    width: 20, height: 2, borderRadius: 2,
  },
  brandWord: {
    fontSize: 22, fontWeight: '900', letterSpacing: 3,
  },
  themeToggleWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    minWidth: 72, justifyContent: 'flex-end',
  },

  // ── Featured card ─────────────────────────────────────────────────────────
  featuredWrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
  },
  featuredImage: { width: '100%', height: 230 },
  featuredOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20,
  },
  featuredTitle: {
    color: '#fff', fontSize: 22, fontWeight: '800',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  featuredSub: {
    color: 'rgba(255,255,255,0.82)', fontSize: 13,
    marginTop: 4, fontWeight: '500',
  },

  // ── Section header ────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20, paddingBottom: 10,
    gap: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  countPill: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 20,
  },
  countPillText: { fontSize: 12, fontWeight: '700' },

  // ── Row card ──────────────────────────────────────────────────────────────
  rowCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 12,
    borderRadius: 16, overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  rowThumb: { width: 90, height: 90 },
  rowContent: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, gap: 3 },
  rowCategory: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  rowTitle: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2, lineHeight: 20 },
  rowCity: { fontSize: 12, fontWeight: '500' },
  rowMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  rowMetaText: { fontSize: 11 },

  // ── List / empty ──────────────────────────────────────────────────────────
  listContent: { paddingBottom: 40 },
  emptyContainer: { flex: 1 },
});

export default styles;