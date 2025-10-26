import { Theme } from '@/src/theme/theme';
import { useTheme } from '@shopify/restyle';
import { Tabs } from 'expo-router';
import { History, House, MapIcon, ScanQrCode } from 'lucide-react-native';
import { View } from 'react-native';

export default function TabsLayout() {
  const theme = useTheme<Theme>();
  const { mainBackground, primary } = theme.colors;

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
          name="scan"
          options={{
            title: 'Scan',
            tabBarIcon: ({ color, size, focused }) => (
              <ScanQrCode color={color} size={size} strokeWidth={focused ? 2 : 1.5} />
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
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size, focused }) => (
              <History color={color} size={size} strokeWidth={focused ? 2 : 1.5} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
