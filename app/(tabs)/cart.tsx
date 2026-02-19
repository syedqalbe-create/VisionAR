import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

const MOCK_ITEMS = [
  {
    id: '1',
    name: 'Nordic Oak Side Table',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400',
    quantity: 1,
  },
  {
    id: '2',
    name: 'Velvet Accent Chair',
    price: 329.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    quantity: 2,
  },
  {
    id: '3',
    name: 'Minimal Floor Lamp',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    quantity: 1,
  },
];

const CARD_RADIUS = 16;
const IMAGE_SIZE = 92;

function CartItemCard({
  id,
  name,
  price,
  image,
  quantity,
  onQty,
  onRemove,
  colors,
  isDark,
}: {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  onQty: (id: string, q: number) => void;
  onRemove: (id: string) => void;
  colors: any;
  isDark: boolean;
}) {
  const lineTotal = price * quantity;
  const contrast = isDark ? colors.background : '#FFF';

  return (
    <View style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image source={{ uri: image }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <View style={styles.itemTop}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
            {name}
          </Text>
          <TouchableOpacity hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} onPress={() => onRemove(id)}>
            <Ionicons name="close-circle-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.itemPrice, { color: colors.primary }]}>${price.toFixed(2)} each</Text>
        <View style={styles.itemBottom}>
          <View style={[styles.stepper, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => onQty(id, Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={18} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.stepperNum, { color: colors.text }]}>{quantity}</Text>
            <TouchableOpacity style={styles.stepperBtn} onPress={() => onQty(id, quantity + 1)}>
              <Ionicons name="add" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.lineTotal, { color: colors.text }]}>${lineTotal.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [items, setItems] = useState(MOCK_ITEMS);

  const contentPad = Math.max(20, Math.min(24, width * 0.055));

  const onQty = (id: string, q: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: q } : i)));
  };
  const onRemove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, paddingHorizontal: contentPad }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Cart</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
            {items.length === 0 ? 'No items' : `${items.length} item${items.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
        {items.length > 0 && (
          <View style={[styles.headerBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="cart" size={18} color={colors.primary} />
            <Text style={[styles.headerBadgeText, { color: colors.text }]}>{items.length}</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: contentPad, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIconWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="cart-outline" size={48} color={colors.iconInactive} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Your cart is empty</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
              Add items from the shop to see them here.
            </Text>
            <TouchableOpacity
              style={[styles.browseBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/products')}
            >
              <Text style={[styles.browseBtnText, { color: isDark ? colors.background : '#FFF' }]}>
                Browse products
              </Text>
              <Ionicons name="arrow-forward" size={18} color={isDark ? colors.background : '#FFF'} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.itemList}>
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  {...item}
                  onQty={onQty}
                  onRemove={onRemove}
                  colors={colors}
                  isDark={isDark}
                />
              ))}
            </View>

            {/* Summary card */}
            <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Order summary</Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Shipping</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>${shipping.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[styles.totalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
              onPress={() => {}}
            >
              <Text style={[styles.checkoutBtnText, { color: isDark ? colors.background : '#FFF' }]}>
                Checkout
              </Text>
              <Ionicons name="card-outline" size={20} color={isDark ? colors.background : '#FFF'} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, marginTop: 2 },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  headerBadgeText: { fontSize: 15, fontWeight: '700' },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 4 },
  itemList: { marginBottom: 24 },
  itemCard: {
    flexDirection: 'row',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  itemContent: { flex: 1, marginLeft: 14, justifyContent: 'space-between' },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  itemPrice: { fontSize: 13, marginTop: 4 },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  stepperBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  stepperNum: { fontSize: 15, fontWeight: '600', minWidth: 20, textAlign: 'center' },
  lineTotal: { fontSize: 16, fontWeight: '700' },

  summaryCard: {
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  totalRow: { marginTop: 8, paddingTop: 14, borderTopWidth: 1, marginBottom: 0 },
  totalLabel: { fontSize: 17, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '800' },

  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: CARD_RADIUS,
  },
  checkoutBtnText: { fontSize: 16, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 48 },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptySub: { fontSize: 15, textAlign: 'center', paddingHorizontal: 24, marginBottom: 28 },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: CARD_RADIUS,
  },
  browseBtnText: { fontSize: 15, fontWeight: '600' },
});
