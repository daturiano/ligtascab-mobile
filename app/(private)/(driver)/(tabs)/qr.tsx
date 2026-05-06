import Box from '@/src/components/ui/Box';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { useWindowDimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function DriverQR() {
  const { driver } = useAuth();
  const { width } = useWindowDimensions();

  // Card sits inside paddingHorizontal: 16 + Card padding 'l' (16) on each side.
  const qrSize = Math.min(width - 32 - 32, 280);

  return (
    <Container style={{ paddingHorizontal: 0, paddingBottom: 0 }}>
      <Box
        width="100%"
        flex={1}
        paddingHorizontal="l"
        paddingTop="l"
        gap="l"
        alignItems="stretch">
        <Box gap="xs">
          <Text variant="title">My QR Code</Text>
          <Text variant="description">
            Show this code to your operator to sign in on their dashboard.
          </Text>
        </Box>

        <Card alignItems="center" gap="l" paddingVertical="xl">
          <Text variant="bodyBold">
            {driver?.first_name ?? ''} {driver?.last_name ?? ''}
          </Text>
          {driver?.id ? (
            <Box
              padding="m"
              backgroundColor="white"
              borderRadius="m"
              borderWidth={1}
              borderColor="grayLighter">
              <QRCode value={driver.id} size={qrSize} backgroundColor="#ffffff" color="#0a0a0a" />
            </Box>
          ) : (
            <Text variant="description">
              QR code unavailable. Please contact your operator.
            </Text>
          )}
          <Text variant="details">Driver ID: {driver?.id?.slice(0, 8) ?? '—'}</Text>
        </Card>

        <Card>
          <Text variant="bodyBold" marginBottom="xs">
            Tip
          </Text>
          <Text variant="description">
            Keep your screen brightness up when presenting your QR. The operator&apos;s scanner
            reads it best in good lighting.
          </Text>
        </Card>
      </Box>
    </Container>
  );
}
