import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storeWishlist, getWishlist } from '@/utils/storage';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  thumbnail: string;
  images: string[];
  rating: number;
  discountPercentage: number;
  stock: number;
  brand: string;
}

type WishlistItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock: boolean;
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [isFullScreen, setIsFullScreen] = useState(false);

  const imageHeight = screenWidth * 0.85;
  const contentPadding = 20;

  useEffect(() => {
    fetchProduct();
    checkWishlistStatus();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await response.json();
      if (data) setProduct(data);
      else setError('Product not found');
    } catch (err) {
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    const wishlist = await getWishlist();
    setIsWishlisted(wishlist.some((item: WishlistItem) => item.id === id));
  };

  const toggleWishlist = async () => {
    const wishlist = await getWishlist();
    if (isWishlisted) {
      await storeWishlist(wishlist.filter((item: WishlistItem) => item.id !== id));
      setIsWishlisted(false);
    } else if (product) {
      await storeWishlist([
        ...wishlist,
        {
          id: product.id.toString(),
          name: product.title,
          brand: product.brand,
          price: product.price,
          originalPrice: product.price * 1.2,
          image: product.images?.[0] || product.thumbnail,
          inStock: product.stock > 0,
        },
      ]);
      setIsWishlisted(true);
    }
  };

  const changeImage = (dir: 'next' | 'prev') => {
    if (!product) return;
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    if (dir === 'next' && activeImage < product.images.length - 1) setActiveImage(activeImage + 1);
    else if (dir === 'prev' && activeImage > 0) setActiveImage(activeImage - 1);
  };

  if (loading) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: colors.background }]}>
        <View style={[styles.miniHeader, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingLabel, { color: colors.textSecondary }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.centered, styles.screen, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={[styles.errorLabel, { color: colors.text }]}>{error || 'Product not found'}</Text>
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.back()}>
          <Text style={[styles.primaryBtnText, { color: colors.text }]}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentPrice = product.discountPercentage > 0
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;
  const originalPrice = product.discountPercentage > 0
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Minimal header */}
      <View style={[styles.miniHeader, { paddingTop: insets.top + 8, backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface }]} onPress={toggleWishlist}>
          <Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={22} color={isWishlisted ? colors.error : colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {/* Main image — tap to expand */}
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.imageWrap, { height: imageHeight, backgroundColor: colors.surface }]}
          onPress={() => setIsFullScreen(true)}
        >
          <Animated.Image
            source={{ uri: product.images?.[activeImage] || product.thumbnail }}
            style={[styles.mainImage, { opacity: fadeAnim }]}
            resizeMode="cover"
          />
          {product.discountPercentage > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: isDark ? colors.background : '#FFF' }]}>
                −{Math.round(product.discountPercentage)}%
              </Text>
            </View>
          )}
          {product.images?.length > 1 && (
            <>
              {activeImage > 0 && (
                <TouchableOpacity style={[styles.navBtn, styles.navLeft, { backgroundColor: colors.surface }]} onPress={() => changeImage('prev')}>
                  <Ionicons name="chevron-back" size={20} color={colors.text} />
                </TouchableOpacity>
              )}
              {activeImage < product.images.length - 1 && (
                <TouchableOpacity style={[styles.navBtn, styles.navRight, { backgroundColor: colors.surface }]} onPress={() => changeImage('next')}>
                  <Ionicons name="chevron-forward" size={20} color={colors.text} />
                </TouchableOpacity>
              )}
              <View style={styles.dots}>
                {product.images.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      { backgroundColor: i === activeImage ? colors.primary : colors.border },
                    ]}
                  />
                ))}
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Content */}
        <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
          {/* Category + brand */}
          <View style={styles.metaRow}>
            <View style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.pillText, { color: colors.textSecondary }]}>{product.category}</Text>
            </View>
            <Text style={[styles.brand, { color: colors.textSecondary }]}>{product.brand}</Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>

          {/* Price row */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>${currentPrice.toFixed(2)}</Text>
            {originalPrice != null && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>${Math.round(originalPrice)}</Text>
            )}
          </View>

          {/* Rating + stock row */}
          <View style={[styles.attrsRow, { borderTopColor: colors.border }]}>
            <View style={styles.attr}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={[styles.attrText, { color: colors.text }]}>{product.rating?.toFixed(1) ?? '—'}</Text>
            </View>
            <View style={[styles.attrDivider, { backgroundColor: colors.border }]} />
            <View style={styles.attr}>
              <Ionicons name="cube-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.attrText, { color: colors.textSecondary }]}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Text>
            </View>
          </View>

          {/* Action buttons — in content above description */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnSecondary, { borderColor: colors.border }]}
              onPress={() => {}}
            >
              <Ionicons name="cube-outline" size={20} color={colors.primary} />
              <Text style={[styles.actionBtnTextSecondary, { color: colors.text }]}>View in AR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary, { backgroundColor: colors.primary }]}
              onPress={() => {}}
            >
              <Ionicons name="cart-outline" size={20} color={isDark ? colors.background : '#FFF'} />
              <Text style={[styles.actionBtnTextPrimary, { color: isDark ? colors.background : '#FFF' }]}>Add to cart</Text>
            </TouchableOpacity>
          </View>

          {/* AR info chip */}
          <View style={[styles.arChip, { backgroundColor: colors.accent + '18', borderColor: colors.accent + '40' }]}>
            <Ionicons name="cube-outline" size={16} color={colors.accent} />
            <Text style={[styles.arChipText, { color: colors.accent }]}>View in AR — see size in your space</Text>
          </View>

          {/* Description — card with label */}
          <View style={[styles.descCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.descLabel, { color: colors.textSecondary }]}>About this product</Text>
            <Text style={[styles.descBody, { color: colors.text }]}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fullscreen image modal */}
      <Modal visible={isFullScreen} transparent animationType="fade" onRequestClose={() => setIsFullScreen(false)}>
        <View style={styles.modalBackdrop}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setIsFullScreen(false)}>
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          <Animated.Image
            source={{ uri: product.images?.[activeImage] || product.thumbnail }}
            style={[styles.modalImage, { opacity: fadeAnim }]}
            resizeMode="contain"
          />
          {product.images?.length > 1 && (
            <>
              {activeImage > 0 && (
                <TouchableOpacity style={[styles.modalNav, styles.modalNavLeft]} onPress={() => changeImage('prev')}>
                  <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
              )}
              {activeImage < product.images.length - 1 && (
                <TouchableOpacity style={[styles.modalNav, styles.modalNavRight]} onPress={() => changeImage('next')}>
                  <Ionicons name="chevron-forward" size={28} color="#FFF" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingScreen: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingLabel: { fontSize: 14, marginTop: 12 },
  errorLabel: { fontSize: 16, marginTop: 12, textAlign: 'center' },
  primaryBtn: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, borderWidth: 1 },
  primaryBtnText: { fontSize: 15, fontWeight: '600' },

  miniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageWrap: { width: '100%', position: 'relative', overflow: 'hidden' },
  mainImage: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 12, left: 16, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  navBtn: { position: 'absolute', top: '50%', marginTop: -20, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  navLeft: { left: 12 },
  navRight: { right: 12 },
  dots: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },

  content: { paddingTop: 20, paddingBottom: 24 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  pillText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  brand: { fontSize: 13, fontWeight: '500' },
  title: { fontSize: 20, fontWeight: '700', lineHeight: 26, marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 14 },
  price: { fontSize: 22, fontWeight: '800' },
  originalPrice: { fontSize: 15, textDecorationLine: 'line-through' },
  attrsRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 14, borderTopWidth: 1 },
  attr: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  attrText: { fontSize: 13, fontWeight: '500' },
  attrDivider: { width: 1, height: 16 },
  arChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  arChipText: { fontSize: 13, fontWeight: '600' },
  descCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  descLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 },
  descBody: { fontSize: 14, lineHeight: 22, fontWeight: '400' },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  actionBtnSecondary: { flex: 1, borderWidth: 1 },
  actionBtnTextSecondary: { fontSize: 14, fontWeight: '600' },
  actionBtnPrimary: { flex: 2 },
  actionBtnTextPrimary: { fontSize: 15, fontWeight: '700' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
  modalClose: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8 },
  modalImage: { width: '100%', height: '80%' },
  modalNav: { position: 'absolute', top: '50%', marginTop: -24, padding: 12 },
  modalNavLeft: { left: 8 },
  modalNavRight: { right: 8 },
});
