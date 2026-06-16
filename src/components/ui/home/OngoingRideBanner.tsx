import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { Navigation, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Box from '../Box';
import Text from '../Text';
import { Ride } from '@/src/types';

export default function OngoingRideBanner({ ride }: { ride: Ride }) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push('/(private)/in-ride')}>
      <Box
        position="absolute"
        bottom={Platform.OS === 'ios' ? 90 : 110}
        left={16}
        right={16}
        backgroundColor="primary"
        borderRadius="l"
        paddingVertical="m"
        paddingHorizontal="l"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        style={styles.shadow}>
        <Box flexDirection="row" alignItems="center" gap="m" flex={1}>
          <Box backgroundColor="white" padding="s" borderRadius="rounded">
            <Navigation size={18} color="#1FAB89" />
          </Box>
          <Box flex={1}>
            <Text color="white" variant="bodyBold" fontSize={15}>
              Your Ride is Ongoing
            </Text>
            <Text color="white" variant="body" fontSize={12} opacity={0.9} numberOfLines={1}>
              Tricycle: {ride.tricycle_details?.plate_number} • Driver:{' '}
              {ride.driver_details?.first_name}
            </Text>
          </Box>
        </Box>
        <ChevronRight size={20} color="white" />
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});
