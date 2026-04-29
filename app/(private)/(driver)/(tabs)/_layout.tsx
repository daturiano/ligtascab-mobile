import { Theme } from '@/src/theme/theme';
import { useTheme } from '@shopify/restyle';
import { Tabs } from 'expo-router';
import { Briefcase, History, LayoutDashboard, QrCode, User } from 'lucide-react-native';
import { View } from 'react-native';

export default function DriverTabsLayout() {
  const theme = useTheme<Theme>();
  const { mainBackground, primary } = theme.colors;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: primary,
          tabBarStyle: { backgroundColor: mainBackground },
          sceneStyle: { backgroundColor: mainBackground },
        }}>
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size, focused }) => (
              <LayoutDashboard color={color} size={size} strokeWidth={focused ? 2 : 1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Jobs',
            tabBarIcon: ({ color, size, focused }) => (
              <Briefcase color={color} size={size} strokeWidth={focused ? 2 : 1.5} />
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
          name="qr"
          options={{
            title: 'My QR',
            tabBarIcon: ({ color, size, focused }) => (
              <QrCode color={color} size={size} strokeWidth={focused ? 2 : 1.5} />
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
    </View>
  );
}
