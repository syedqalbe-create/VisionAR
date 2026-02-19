import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Platform, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width: screenWidth } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === 'ios' ? insets.bottom : 12;

  const getIcon = (routeName: string) => {
    switch (routeName) {
      case 'index': return 'home';
      case 'products': return 'grid';
      case 'cart': return 'cart';
      case 'profile': return 'person';
      default: return 'home';
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'index': return 'Home';
      case 'products': return 'Shop';
      case 'cart': return 'Cart';
      case 'profile': return 'Profile';
      default: return 'Home';
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: bottom + 8,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.12,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: colors.tabBar,
          borderRadius: 32,
          borderWidth: 1,
          borderColor: colors.tabBarBorder,
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 24,
                backgroundColor: isFocused ? colors.primary + '18' : 'transparent',
              }}
            >
              <Ionicons
                name={getIcon(route.name) as any}
                size={24}
                color={isFocused ? colors.primary : colors.iconInactive}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: isFocused ? '600' : '500',
                  color: isFocused ? colors.primary : colors.textSecondary,
                  marginTop: 4,
                }}
              >
                {getLabel(route.name)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="products" options={{ title: 'Shop' }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
