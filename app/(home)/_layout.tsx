import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Tabs } from 'expo-router';
import { Bike, CircleUser, Heart, Search } from 'lucide-react-native';
import React from 'react';
import { Platform, Text, View } from 'react-native';

export default function TabLayout() {
  return (
    <View className="flex-1">
      <View className="flex items-center justify-center pt-16 bg-white">
        <Text className="text-xl font-bold text-gray-900">ligtascab.</Text>
      </View>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#1daa88',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
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
          name="index"
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
              <Bike
                color={color}
                size={size}
                strokeWidth={focused ? 2.5 : 1.5}
              />
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
    </View>
  );
}
