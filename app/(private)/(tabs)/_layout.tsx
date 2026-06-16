import Box from '@/src/components/ui/Box';
import { Theme } from '@/src/theme/theme';
import { useTheme } from '@shopify/restyle';
import { Tabs } from 'expo-router';
import { History, House, MapIcon, ScanQrCode, User } from 'lucide-react-native';
import { View } from 'react-native';
import { useRideStore } from '@/src/store/useRideStore';
import OngoingRideBanner from '@/src/components/ui/home/OngoingRideBanner';

export default function TabsLayout() {
  const theme = useTheme<Theme>();
  const { mainBackground, primary } = theme.colors;
  const { rideDetails } = useRideStore();

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: primary,
          tabBarStyle: { backgroundColor: mainBackground },
          sceneStyle: { backgroundColor: mainBackground },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <House color={color} size={size} strokeWidth={focused ? 2 : 1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="terminals"
          options={{
            title: 'Terminals',
            tabBarIcon: ({ color, size, focused }) => (
              <MapIcon color={color} size={size} strokeWidth={focused ? 2 : 1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: 'Scan',
            tabBarIcon: ({ color, size, focused }) => (
              <Box
                padding="m"
                backgroundColor="mainBackground"
                borderColor="primary"
                borderWidth={2}
                borderRadius="rounded"
                mb="xxl">
                <ScanQrCode color={primary} size={size} strokeWidth={2} />
              </Box>
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size, focused }) => (
              <History color={color} size={size} strokeWidth={focused ? 2 : 1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <User color={color} size={size} strokeWidth={focused ? 2 : 1.5} />
            ),
          }}
        />
      </Tabs>
      {rideDetails && <OngoingRideBanner ride={rideDetails} />}
    </View>
  );
}
