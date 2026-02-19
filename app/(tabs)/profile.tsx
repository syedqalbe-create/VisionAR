import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getWishlist } from '@/utils/storage';
import { getCart } from '@/utils/storage';

const AVATAR_SIZE = 96;
const CARD_PADDING = 24;

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 40, 360);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCounts = async () => {
      const [wishlist, cart] = await Promise.all([getWishlist(), getCart()]);
      setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
      setCartCount(Array.isArray(cart) ? cart.length : 0);
    };
    loadCounts();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* —— Profile header: centered avatar + name —— */}
        <View style={styles.header}>
          <View style={[styles.avatarWrap, { borderColor: colors.border }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256' }}
              style={styles.avatar}
            />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>John Doe</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>john.doe@example.com</Text>
          <View style={[styles.memberBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="ribbon-outline" size={14} color={colors.accent} />
            <Text style={[styles.memberBadgeText, { color: colors.textSecondary }]}>Member since 2024</Text>
          </View>
        </View>

        {/* —— Stats row —— */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border, width: cardWidth }]}>
          <TouchableOpacity style={styles.statItem} onPress={() => router.push('/(tabs)/products')}>
            <Text style={[styles.statValue, { color: colors.primary }]}>—</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>AR sessions</Text>
          </TouchableOpacity>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.statItem} onPress={() => router.push('/(tabs)/products')}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{wishlistCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wishlist</Text>
          </TouchableOpacity>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.statItem} onPress={() => router.push('/(tabs)/cart')}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{cartCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cart</Text>
          </TouchableOpacity>
        </View>

        {/* —— Primary action card —— */}
        <View style={styles.cardWrap}>
          <TouchableOpacity
            style={[styles.primaryCard, { backgroundColor: colors.surface, borderColor: colors.border, width: cardWidth }]}
            onPress={() => router.push('/(tabs)/products')}
            activeOpacity={0.85}
          >
            <View style={[styles.primaryCardIconWrap, { backgroundColor: colors.primary }]}>
              <Ionicons name="cube-outline" size={28} color={isDark ? colors.background : '#FFF'} />
            </View>
            <View style={styles.primaryCardText}>
              <Text style={[styles.primaryCardTitle, { color: colors.text }]}>Try AR in your space</Text>
              <Text style={[styles.primaryCardSub, { color: colors.textSecondary }]}>View products in augmented reality</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* —— Theme toggle —— */}
        <View style={styles.cardWrap}>
          <TouchableOpacity
            style={[styles.rowCard, { backgroundColor: colors.surface, borderColor: colors.border, width: cardWidth }]}
            onPress={toggleTheme}
            activeOpacity={0.85}
          >
            <View style={[styles.rowCardIconWrap, { backgroundColor: isDark ? colors.accentMuted : colors.accent }]}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color="#FFF" />
            </View>
            <View style={styles.rowCardText}>
              <Text style={[styles.rowCardTitle, { color: colors.text }]}>{isDark ? 'Dark mode' : 'Light mode'}</Text>
              <Text style={[styles.rowCardSub, { color: colors.textSecondary }]}>Tap to switch theme</Text>
            </View>
            <View style={[styles.togglePill, { backgroundColor: isDark ? colors.accent : colors.border }]}>
              <View style={[styles.toggleThumb, { backgroundColor: '#FFF', marginLeft: isDark ? 20 : 2 }]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* —— About AR card —— */}
        <View style={styles.cardWrap}>
          <View style={[styles.aboutCard, { backgroundColor: colors.surface, borderColor: colors.border, width: cardWidth }]}>
            <View style={[styles.aboutIconWrap, { backgroundColor: colors.accent + '20' }]}>
              <Ionicons name="sparkles" size={24} color={colors.accent} />
            </View>
            <View style={styles.aboutText}>
              <Text style={[styles.aboutTitle, { color: colors.text }]}>See it in your space</Text>
              <Text style={[styles.aboutBody, { color: colors.textSecondary }]}>
                Place furniture and products in AR to check size and style before you buy. Tap "View in AR" on any product to start.
              </Text>
            </View>
          </View>
        </View>

        {/* —— Quick actions —— */}
        <View style={[styles.quickActionsWrap, { width: cardWidth }]}>
          <Text style={[styles.quickActionsLabel, { color: colors.textSecondary }]}>Quick actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={[styles.quickActionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push('/(tabs)/products')}
              activeOpacity={0.85}
            >
              <Ionicons name="grid-outline" size={20} color={colors.primary} />
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>Browse</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push('/(tabs)/cart')}
              activeOpacity={0.85}
            >
              <Ionicons name="cart-outline" size={20} color={colors.primary} />
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>Cart</Text>
              {cartCount > 0 && (
                <View style={[styles.quickActionBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.quickActionBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push('/(tabs)/index')}
              activeOpacity={0.85}
            >
              <Ionicons name="home-outline" size={20} color={colors.primary} />
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* —— Spacer —— */}
        <View style={styles.spacer} />

        {/* —— Log out —— */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.border, width: cardWidth }]}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Log out</Text>
        </TouchableOpacity>

        <Text style={[styles.footer, { color: colors.textSecondary }]}>VisionAR</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingHorizontal: 20 },
  header: { alignItems: 'center', marginBottom: 32 },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  email: { fontSize: 15, marginBottom: 10 },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  memberBadgeText: { fontSize: 12, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 18,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, fontWeight: '600' },
  statDivider: { width: 1, height: 28 },
  cardWrap: { marginBottom: 14, alignItems: 'center', width: '100%' },
  primaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: CARD_PADDING,
    borderRadius: 20,
    borderWidth: 1,
  },
  primaryCardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  primaryCardText: { flex: 1 },
  primaryCardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  primaryCardSub: { fontSize: 13 },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: CARD_PADDING,
    borderRadius: 20,
    borderWidth: 1,
  },
  rowCardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowCardText: { flex: 1 },
  rowCardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  rowCardSub: { fontSize: 12 },
  togglePill: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  aboutCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: CARD_PADDING,
    borderRadius: 20,
    borderWidth: 1,
  },
  aboutIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  aboutText: { flex: 1 },
  aboutTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  aboutBody: { fontSize: 13, lineHeight: 20 },
  quickActionsWrap: { marginBottom: 20 },
  quickActionsLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 4,
  },
  quickActionsRow: { flexDirection: 'row', gap: 10 },
  quickActionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    position: 'relative',
  },
  quickActionLabel: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  quickActionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  quickActionBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
  spacer: { height: 24 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  logoutText: { fontSize: 16, fontWeight: '600' },
  footer: { fontSize: 12, marginTop: 24 },
});
