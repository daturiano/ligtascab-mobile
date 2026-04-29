import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { LogOut, Mail, MapPin, Phone, ShieldCheck, Star } from 'lucide-react-native';
import { ScrollView } from 'react-native';

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function DriverProfile() {
  const { driver, signOutUser } = useAuth();

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <Container style={{ paddingHorizontal: 0, paddingBottom: 0 }}>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 16 }}>
        <Text variant="title">My Profile</Text>

        {/* Identity card */}
        <Card>
          <Box gap="xs">
            <Text variant="subheader">
              {driver?.first_name ?? ''} {driver?.last_name ?? ''}
            </Text>
            <Text variant="description">Driver ID: {driver?.id?.slice(0, 8) ?? '—'}</Text>
            {typeof driver?.rating === 'number' && (
              <Box flexDirection="row" alignItems="center" gap="xs" marginTop="s">
                <Star color="#EF9651" size={16} fill="#EF9651" />
                <Text variant="bodyBold">{driver.rating.toFixed(1)}</Text>
                {typeof driver.total_reviews === 'number' && (
                  <Text variant="details">({driver.total_reviews} reviews)</Text>
                )}
              </Box>
            )}
          </Box>
        </Card>

        {/* Contact details */}
        <Card>
          <Text variant="bodyBold" marginBottom="s">
            Contact
          </Text>
          <Box gap="m">
            <Box flexDirection="row" alignItems="center" gap="s">
              <Phone color="#737373" size={16} />
              <Text variant="body">{driver?.phone_number ?? '—'}</Text>
            </Box>
            {driver?.email ? (
              <Box flexDirection="row" alignItems="center" gap="s">
                <Mail color="#737373" size={16} />
                <Text variant="body">{driver.email}</Text>
              </Box>
            ) : null}
            <Box flexDirection="row" alignItems="flex-start" gap="s">
              <MapPin color="#737373" size={16} />
              <Text variant="body" flex={1}>
                {driver?.address ?? '—'}
              </Text>
            </Box>
          </Box>
        </Card>

        {/* License card */}
        <Card>
          <Box flexDirection="row" alignItems="center" gap="s" marginBottom="s">
            <ShieldCheck color="#1FAB89" size={18} />
            <Text variant="bodyBold">License</Text>
          </Box>
          <Box gap="xs">
            <Box flexDirection="row" justifyContent="space-between">
              <Text variant="details">License No.</Text>
              <Text variant="body">{driver?.license_number ?? '—'}</Text>
            </Box>
            <Box flexDirection="row" justifyContent="space-between">
              <Text variant="details">Expiration</Text>
              <Text variant="body">{formatDate(driver?.license_expiration)}</Text>
            </Box>
          </Box>
        </Card>

        {/* Emergency contact */}
        <Card>
          <Text variant="bodyBold" marginBottom="s">
            Emergency Contact
          </Text>
          <Box gap="xs">
            <Box flexDirection="row" justifyContent="space-between">
              <Text variant="details">Name</Text>
              <Text variant="body">{driver?.emergency_contact_name ?? '—'}</Text>
            </Box>
            <Box flexDirection="row" justifyContent="space-between">
              <Text variant="details">Number</Text>
              <Text variant="body">{driver?.emergency_contact_number ?? '—'}</Text>
            </Box>
          </Box>
        </Card>

        <Button variant="destructive" onPress={handleSignOut}>
          <Box flexDirection="row" alignItems="center" gap="s">
            <LogOut color="#fff" size={16} />
            <Text color="white" variant="bodyBold">
              Sign Out
            </Text>
          </Box>
        </Button>
      </ScrollView>
    </Container>
  );
}
