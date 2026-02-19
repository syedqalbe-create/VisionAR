import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { HeaderBackButton } from '@/components/HeaderBackButton';

export default function ProfileLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => <HeaderBackButton />,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontSize: 18, fontWeight: '600', color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
