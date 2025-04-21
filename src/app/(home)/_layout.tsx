import BlurTabBarBackground from '@/src/components/ui/TabBarBackground.ios';
import { NAV_THEME } from '@/src/lib/constants';
import { Tabs } from 'expo-router';
import { Bike, CircleUser, Heart, Search } from 'lucide-react-native';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: NAV_THEME[colorScheme ?? 'light'].primary,
        headerShown: false,
        tabBarBackground: BlurTabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size, focused }) => (
            <Search
              color={color}
              size={size}
              strokeWidth={focused ? 2.5 : 1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size, focused }) => (
            <Heart
              color={color}
              size={size}
              fill={focused ? color : '#ffffff'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size, focused }) => (
            <Bike color={color} size={size} strokeWidth={focused ? 2.5 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <CircleUser
              color={color}
              size={size}
              strokeWidth={focused ? 2.5 : 1.5}
            />
          ),
        }}
      />
    </Tabs>
  );
}
