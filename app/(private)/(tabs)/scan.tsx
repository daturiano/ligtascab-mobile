import Box from '@/src/components/ui/Box';
import Container from '@/src/components/ui/Container';
import HomeHeader from '@/src/components/ui/home/HomeHeader';
import QRScanner from '@/src/components/ui/scan/QRScanner';

export default function Scan() {
  return (
    <Container style={{ paddingHorizontal: 0, paddingTop: 0 }}>
      <HomeHeader
        title="Scan QR Code"
        description="Scan the QR to get your tricycle's details and to start and confirm your ride."
      />
      <Box flex={1} paddingHorizontal="l" gap="l" width={'100%'} style={{ marginTop: 210 }}>
        <QRScanner />
      </Box>
    </Container>
  );
}
