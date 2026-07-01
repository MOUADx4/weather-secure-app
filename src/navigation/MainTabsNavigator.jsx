import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LayoutDashboard, Search, Star, User } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { useHaptic } from '../hooks/useHaptic';
import { Font } from '../theme/fonts';
import { TableauBordScreen } from '../screens/TableauBordScreen';
import { RechercheScreen } from '../screens/RechercheScreen';
import { FavorisScreen } from '../screens/FavorisScreen';
import { ProfilScreen } from '../screens/ProfilScreen';

const Tab = createBottomTabNavigator();

const ICONES = {
  Accueil: LayoutDashboard,
  Recherche: Search,
  Favoris: Star,
  Profil: User,
};

function BoutonOnglet({ focused, route, label, color, onPress }) {
  const { colors } = useTheme();
  const { light } = useHaptic();
  const scale = useSharedValue(1);
  const Icone = ICONES[route.name];

  const styleAnime = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const presser = () => {
    light();
    scale.value = withSpring(0.88, { damping: 20, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 18, stiffness: 280 });
    }, 110);
    onPress();
  };

  return (
    <Pressable
      onPress={presser}
      style={styles.item}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
    >
      <View style={[styles.pill, focused && { backgroundColor: colors.primary }]} />
      <Animated.View style={[styles.icone, styleAnime]}>
        <Icone color={color} size={22} strokeWidth={focused ? 2.2 : 1.7} />
      </Animated.View>
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function DockTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={[styles.dockOuter, { paddingBottom: Math.max(insets.bottom, 8) + 4 }]}>
      <View style={[styles.dockInner, { backgroundColor: colors.dock, borderColor: colors.border }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label = String(options.title ?? route.name);
          const color = focused ? colors.primary : colors.textMuted;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <BoutonOnglet
              key={route.key}
              focused={focused}
              route={route}
              label={label}
              color={color}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

export function MainTabsNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <DockTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
    >
      <Tab.Screen name="Accueil" component={TableauBordScreen} />
      <Tab.Screen name="Recherche" component={RechercheScreen} />
      <Tab.Screen name="Favoris" component={FavorisScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  dockOuter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 6,
    backgroundColor: 'transparent',
  },
  dockInner: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingTop: 4,
    borderRadius: 26,
    borderWidth: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  pill: {
    width: 24,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  icone: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    fontFamily: Font.semiBold,
    fontSize: 10,
    letterSpacing: 0.1,
  },
});
