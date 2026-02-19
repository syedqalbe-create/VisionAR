import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

/**
 * Back button for stack headers. Uses router.back() so it works
 * even when the stack has only one screen (e.g. navigated from tabs).
 */
export function HeaderBackButton() {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{
        marginLeft: Platform.OS === 'ios' ? 8 : 0,
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.surface,
        marginRight: 8,
      }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Ionicons name="arrow-back" size={24} color={colors.text} />
    </TouchableOpacity>
  );
}
