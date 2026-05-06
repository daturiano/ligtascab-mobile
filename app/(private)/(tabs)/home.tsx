import Box from '@/src/components/ui/Box';
import Container from '@/src/components/ui/Container';
import HomeCard from '@/src/components/ui/home/HomeCard';
import HomeHeader from '@/src/components/ui/home/HomeHeader';
import RecentRides from '@/src/components/ui/home/RecentRides';
import SafetyTip from '@/src/components/ui/home/SafetyTip';
import { Hand, MapIcon, QrCode } from 'lucide-react-native';
import { ScrollView } from 'react-native';

import { useAuth } from '@/src/context/AuthenticationContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <Container style={{ paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20
        
       }}>
        <HomeHeader
          title={`Hello, ${user?.first_name || 'Commuter'}! 👋`}
          description="Ready for your next safe ride?"
        />
        <Box
          flex={1}
          width="100%"
          style={{ marginTop: 210 }}
          paddingHorizontal="l"
          gap="l"
          justifyContent="space-between">
          <Box flexDirection="column" gap="l" flexGrow={1}>
            <Box flexDirection="row" justifyContent="space-between" gap="l" alignItems="center">
              <HomeCard
                path="scan"
                title="Scan QR"
                icon={QrCode}
                source={require('@/src/assets/qr.png')}
              />
              <HomeCard
                path="terminals"
                title="Find Terminal"
                icon={MapIcon}
                source={require('@/src/assets/find.png')}
              />
            </Box>
            <Box flexDirection="row" justifyContent="space-between" gap="l" alignItems="center">
              <HomeCard
                path="pickup"
                title="Pick Me Up"
                icon={Hand}
                source={require('@/src/assets/find.png')}
              />
            </Box>
            <RecentRides />
            <SafetyTip />
          </Box>
        </Box>
      </ScrollView>
    </Container>
  );
}
