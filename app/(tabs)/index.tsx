import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  useWindowDimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

const H_PAD = 20;
const H_PAD_PCT = 0.055;

// —— How it works: short steps
const STEPS = [
  { step: 1, title: 'Scan your space', body: 'Point your camera at the room', icon: 'scan-outline' as const },
  { step: 2, title: 'Place the product', body: 'Drag and drop in AR', icon: 'hand-left-outline' as const },
  { step: 3, title: 'See real size', body: 'Check fit and style', icon: 'resize-outline' as const },
];

// —— Detailed AR guide sections
const AR_GUIDE = [
  {
    title: 'What is AR in VisionAR?',
    body: 'Augmented Reality (AR) lets you place 3D models of products into your real environment using your phone’s camera. You see the item at real size in your room, so you can check fit, style, and placement before buying.',
    icon: 'cube-outline' as const,
  },
  {
    title: 'Before you start',
    body: 'Make sure you’re in a well-lit space and have a clear view of the floor or surface where you want to place the product. Move your phone slowly so the app can detect the room. Avoid very reflective or uniform surfaces for best results.',
    icon: 'sunny-outline' as const,
  },
  {
    title: 'Starting an AR session',
    body: 'Tap “Open AR” or “View in AR” on the home screen or on any product. Allow camera access when prompted. Point your camera at the floor or a flat surface. When a grid or anchor appears, tap to place the product. You can then move, rotate, or resize it using the on-screen controls.',
    icon: 'hand-left-outline' as const,
  },
  {
    title: 'Moving and rotating',
    body: 'Use one finger to drag the product to a new position. Use two fingers to rotate it. Pinch to scale if the app supports resizing. Take a few steps back to see how it looks at real scale in your space.',
    icon: 'move-outline' as const,
  },
  {
    title: 'Tips for best results',
    body: 'Keep the product in view while you adjust it. Try different angles and distances. If placement is unstable, improve lighting or choose a different surface. When you’re happy with the view, you can take a screenshot or add the item to your cart from the AR screen.',
    icon: 'bulb-outline' as const,
  },
];

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const hPad = Math.max(16, Math.min(24, screenWidth * H_PAD_PCT));
  const cardRadius = Math.min(22, 14 + screenWidth * 0.02);
  const stepCardRadius = Math.min(20, 12 + screenWidth * 0.018);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8, paddingBottom: 120, paddingHorizontal: hPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* —— 1. Minimal top bar: logo + search + profile —— */}
        <View style={styles.topBar}>
          <Text style={[styles.logo, { color: colors.text }]}>VisionAR</Text>
          <View style={styles.topBarRight}>
            <TouchableOpacity
              style={[styles.topIconWrap, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(tabs)/products')}
            >
              <Ionicons name="search" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.topIconWrap, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Ionicons name="person-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* —— 2. AR CTA: solid block, no image —— */}
        <TouchableOpacity
          style={[styles.arCtaWrap, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/products')}
          activeOpacity={0.9}
        >
          <View style={styles.arCtaContent}>
            <View style={styles.arCtaLeft}>
              <View style={[styles.arCtaIconCircle, { backgroundColor: isDark ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.25)' }]}>
                <Ionicons name="cube" size={32} color={isDark ? colors.background : '#FFF'} />
              </View>
              <View style={styles.arCtaTextBlock}>
                <Text style={[styles.arCtaTitle, { color: isDark ? colors.background : '#FFF' }]}>Try it in your space</Text>
                <Text style={[styles.arCtaSub, { color: isDark ? colors.textSecondary : 'rgba(255,255,255,0.9)' }]}>See true size and style with AR</Text>
              </View>
            </View>
            <View style={[styles.arCtaButton, { backgroundColor: isDark ? colors.background : '#FFF' }]}>
              <Text style={[styles.arCtaButtonText, { color: colors.primary }]}>Open AR</Text>
              <Ionicons name="camera" size={20} color={colors.primary} />
            </View>
          </View>
        </TouchableOpacity>

        {/* —— 3. How it works: vertical list with numbers —— */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>How it works</Text>
        <View style={[styles.stepsCard, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: stepCardRadius }]}>
          {STEPS.map((item) => (
            <View key={item.step} style={[styles.stepRow, item.step < STEPS.length ? { borderBottomColor: colors.border } : null]}>
              <View style={[styles.stepNum, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumText, { color: isDark ? colors.background : '#FFF' }]}>{item.step}</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.stepBodyText, { color: colors.textSecondary }]}>{item.body}</Text>
              </View>
              <Ionicons name={item.icon} size={22} color={colors.iconInactive} />
            </View>
          ))}
        </View>

        {/* —— 4. How to use AR: detailed guide —— */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>How to use AR</Text>
        <View style={styles.guideList}>
          {AR_GUIDE.map((section, index) => (
            <View
              key={index}
              style={[
                styles.guideCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: cardRadius,
                },
              ]}
            >
              <View style={[styles.guideIconWrap, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name={section.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.guideText}>
                <Text style={[styles.guideTitle, { color: colors.text }]}>{section.title}</Text>
                <Text style={[styles.guideBody, { color: colors.textSecondary }]}>{section.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* —— 5. Bottom CTA strip —— */}
        <TouchableOpacity
          style={[styles.bottomCta, { backgroundColor: colors.surfaceElevated || colors.surface, borderColor: colors.border, borderRadius: cardRadius }]}
          onPress={() => router.push('/(tabs)/products')}
        >
          <Ionicons name="camera-outline" size={24} color={colors.accent} />
          <View style={styles.bottomCtaText}>
            <Text style={[styles.bottomCtaTitle, { color: colors.text }]}>Scan your room</Text>
            <Text style={[styles.bottomCtaSub, { color: colors.textSecondary }]}>Start an AR session</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  topBarRight: { flexDirection: 'row', gap: 10 },
  topIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arCtaWrap: { marginBottom: 28, borderRadius: 24, overflow: 'hidden', minHeight: 120, padding: 20, justifyContent: 'center' },
  arCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arCtaLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  arCtaIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  arCtaTextBlock: { flex: 1 },
  arCtaTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  arCtaSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  arCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    gap: 8,
  },
  arCtaButtonText: { fontSize: 15, fontWeight: '700' },
  sectionLabel: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  stepsCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 28,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepNumText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  stepBody: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  stepBodyText: { fontSize: 13 },
  guideList: { marginBottom: 24 },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  guideIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  guideText: { flex: 1 },
  guideTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  guideBody: { fontSize: 14, lineHeight: 22 },
  bottomCta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  bottomCtaText: { flex: 1 },
  bottomCtaTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  bottomCtaSub: { fontSize: 13 },
});
