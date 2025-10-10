import Box from '@/src/components/ui/Box';
import Container from '@/src/components/ui/Container';
import HomeCard from '@/src/components/ui/home/HomeCard';
import HomeHeader from '@/src/components/ui/home/HomeHeader';
import RecentRides from '@/src/components/ui/home/RecentRides';
import SafetyTip from '@/src/components/ui/home/SafetyTip';
import { MapIcon, QrCode } from 'lucide-react-native';

export default function Home() {
  return (
    <Container style={{ paddingHorizontal: 0, paddingTop: 0 }}>
      <HomeHeader />
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
          <RecentRides />
        </Box>
        <SafetyTip />
      </Box>
    </Container>
  );
}
