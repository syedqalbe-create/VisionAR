import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const { colors } = useTheme();
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.surface }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
        <ThemedText style={[styles.backLabel, { color: colors.text }]}>Go back</ThemedText>
      </TouchableOpacity>
      <ThemedText type="title">This screen does not exist.</ThemedText>
      <Link href="/" style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
  },
  backLabel: { fontSize: 16, fontWeight: '600' },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
