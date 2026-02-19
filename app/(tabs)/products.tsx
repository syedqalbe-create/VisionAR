import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  rating: number;
  discountPercentage: number;
  stock: number;
  brand: string;
}

interface Category {
  name: string;
  image: string;
  productCount: number;
}

export default function ProductListScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    const timeoutMs = 20000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    let settled = false;
    const stopLoading = () => {
      if (!settled) {
        settled = true;
        setLoading(false);
      }
    };

    fetch('https://dummyjson.com/products?limit=60', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data?.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        const message =
          err?.name === 'AbortError'
            ? 'Request timed out. Check your connection.'
            : err?.message || 'Failed to load products. Check your connection.';
        setError(message);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        stopLoading();
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategory) list = list.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, searchQuery, selectedCategory]);

  const categories = useMemo((): Category[] => {
    if (!products.length) return [];
    const map = new Map<string, { count: number; image: string }>();
    products.forEach((p) => {
      if (!p.category) return;
      if (!map.has(p.category)) {
        map.set(p.category, { count: 1, image: p.thumbnail || '' });
      } else {
        const cur = map.get(p.category)!;
        map.set(p.category, { count: cur.count + 1, image: cur.image || p.thumbnail });
      }
    });
    return Array.from(map.entries())
      .map(([name, { count, image }]) => ({ name, image, productCount: count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const renderProduct = ({ item }: { item: Product }) => {
    const discountPrice = item.discountPercentage > 0
      ? item.price * (1 - item.discountPercentage / 100)
      : item.price;
    return (
      <TouchableOpacity
        style={[styles.productRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: String(item.id) } })}
        activeOpacity={0.85}
      >
        <View style={styles.productRowLeft}>
          <View style={styles.productImageWrap}>
            <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
            {item.discountPercentage > 0 && (
              <View style={[styles.discountPill, { backgroundColor: colors.error }]}>
                <Text style={styles.discountPillText}>-{Math.round(item.discountPercentage)}%</Text>
              </View>
            )}
          </View>
          <View style={styles.productMeta}>
            <Text style={[styles.productBrand, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.brand || 'Brand'}
            </Text>
            <Text style={[styles.productTitle, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.ratingWrap}>
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                {item.rating?.toFixed(1) || '0'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.productRowRight}>
          <Text style={[styles.productPrice, { color: colors.primary }]}>
            ${discountPrice.toFixed(2)}
          </Text>
          {item.discountPercentage > 0 && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              ${item.price.toFixed(2)}
            </Text>
          )}
          <TouchableOpacity
            style={[styles.addIconBtn, { backgroundColor: colors.primary }]}
            onPress={(e) => {
              e.stopPropagation();
            }}
          >
            <Ionicons name="add" size={22} color={isDark ? colors.background : '#FFF'} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={fetchProducts}>
          <Text style={[styles.retryText, { color: isDark ? colors.background : '#FFF' }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header: title + search */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.titleRow}>
          {selectedCategory ? (
            <>
              <TouchableOpacity
                style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setSelectedCategory(null)}
              >
                <Ionicons name="arrow-back" size={22} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.pageTitle, { color: colors.text }]} numberOfLines={1}>
                {selectedCategory.replace(/-/g, ' ')}
              </Text>
            </>
          ) : (
            <Text style={[styles.pageTitle, { color: colors.text }]}>Shop</Text>
          )}
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category chips — horizontal scroll (no image grid) */}
      <View style={styles.chipSection}>
        <FlatList
          horizontal
          data={[
            { id: null, label: 'All', count: products.length },
            ...categories.map((c) => ({
              id: c.name as string | null,
              label: c.name.replace(/-/g, ' '),
              count: c.productCount,
            })),
          ]}
          keyExtractor={(item) => item.id ?? 'all'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Text
                  style={[styles.chipText, { color: isActive ? '#FFF' : colors.text }]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Product count */}
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: colors.textSecondary }]}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Single-column list of product rows */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={colors.iconInactive} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No products match your search</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 15 },
  errorText: { marginTop: 12, textAlign: 'center', fontSize: 15 },
  retryBtn: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  retryText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  header: { paddingHorizontal: 20, paddingBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  pageTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, flex: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0 },
  chipSection: { marginBottom: 12 },
  chipList: { paddingHorizontal: 20, gap: 10, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  chipText: { fontSize: 14, fontWeight: '600' },
  countRow: { paddingHorizontal: 20, marginBottom: 8 },
  countText: { fontSize: 13 },
  listContent: { paddingHorizontal: 20 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { marginTop: 12, fontSize: 15 },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  productRowLeft: { flexDirection: 'row', flex: 1, marginRight: 12 },
  productImageWrap: {
    position: 'relative',
    width: 88,
    height: 88,
    borderRadius: 14,
    overflow: 'hidden',
  },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  discountPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountPillText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
  productMeta: { flex: 1, justifyContent: 'center', minWidth: 0 },
  productBrand: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  productTitle: { fontSize: 15, fontWeight: '600', lineHeight: 20, marginBottom: 6 },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12 },
  productRowRight: { alignItems: 'flex-end' },
  productPrice: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  originalPrice: { fontSize: 12, textDecorationLine: 'line-through', marginBottom: 8 },
  addIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
