import { Stack, usePathname } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

import { NAV_THEME } from '@/lib/constants';
import { Link } from 'expo-router';
import { ClipboardMinus, HandCoins, TextSearch } from 'lucide-react-native';

const data = {
  navMain: [
    {
      title: 'Terminals',
      url: '/',
      pathname: '/',
      icon: TextSearch,
    },
    {
      title: 'Calculate Fare',
      url: '/fare-calculator',
      pathname: 'fare-calculator',
      icon: HandCoins,
    },
    {
      title: 'Report',
      url: 'report',
      pathname: 'report',
      icon: ClipboardMinus,
    },
  ],
};

export default function IndexStackLayout() {
  const pathname = usePathname();
  const path = pathname === '/' ? pathname : pathname.substring(1);
  console.log(path);
  return (
    <View className="flex-1 flex-col bg-background">
      <View className="flex flex-col pt-14 bg-primary gap-4 px-4">
        <View className="flex items-center justify-center">
          <Text className="text-background font-bold text-2xl">ligtascab.</Text>
        </View>
        <View className="flex-row justify-between bg-primary py-4">
          {data.navMain.map((item) => {
            return (
              <Link href={item.url} asChild key={item.title}>
                <TouchableOpacity
                  className={`flex-row py-2 px-4 gap-2 rounded-3xl ${
                    path.startsWith(item.pathname)
                      ? 'border border-background'
                      : ''
                  }`}
                >
                  <item.icon color={NAV_THEME.light.background} size={18} />
                  <Text className="text-background text-sm">{item.title}</Text>
                </TouchableOpacity>
              </Link>
            );
          })}
        </View>
      </View>
      <Stack screenOptions={{ headerShown: false }} />;
    </View>
  );
}
