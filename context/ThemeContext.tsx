import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, storeTheme } from '@/utils/storage';

export type ThemeType = 'light' | 'dark';

// Minimal theme — dark grey tones only (no black), soft and minimal
export const lightTheme = {
  background: '#F2F2F2',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFAFA',
  primary: '#374151',
  primaryMuted: '#4B5563',
  accent: '#059669',
  accentMuted: '#10B981',
  border: '#E5E5E5',
  text: '#374151',
  textSecondary: '#6B7280',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E5E5',
  card: '#FFFFFF',
  cardBorder: '#E5E5E5',
  icon: '#374151',
  iconInactive: '#9CA3AF',
  success: '#059669',
  error: '#DC2626',
  overlay: 'rgba(55, 65, 81, 0.4)',
};

export const darkTheme = {
  background: '#252529',
  surface: '#2D2D32',
  surfaceElevated: '#36363B',
  primary: '#E5E5E7',
  primaryMuted: '#D1D5DB',
  accent: '#10B981',
  accentMuted: '#34D399',
  border: '#3F3F44',
  text: '#E5E5E7',
  textSecondary: '#9CA3AF',
  tabBar: '#252529',
  tabBarBorder: '#3F3F44',
  card: '#2D2D32',
  cardBorder: '#3F3F44',
  icon: '#E5E5E7',
  iconInactive: '#6B7280',
  success: '#34D399',
  error: '#F87171',
  overlay: 'rgba(37, 37, 41, 0.75)',
};

export type ThemeColors = typeof lightTheme;

type ThemeContextType = {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightTheme,
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(deviceTheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getTheme();
      if (savedTheme !== null) {
        setTheme(savedTheme ? 'dark' : 'light');
      } else {
        setTheme(deviceTheme === 'dark' ? 'dark' : 'light');
      }
    };
    loadTheme();
  }, [deviceTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await storeTheme(newTheme === 'dark');
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
