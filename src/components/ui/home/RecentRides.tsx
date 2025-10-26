import { fetchRecentRides } from '@/src/services/rides';
import { Ride } from '@/src/types';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import RideDetailsCard from './RideDetailsCard';
import { useRouter } from 'expo-router';

export default function RecentRides() {
  const router = useRouter();

  const { data: recent_rides } = useQuery<Ride[]>({
    queryKey: ['recent_rides'],
    queryFn: fetchRecentRides,
  });

  const rides = recent_rides?.flatMap((p) => p) || [];

  return (
    <Box
      flex={1}
      flexGrow={1}
      borderRadius="m"
      backgroundColor="white"
      flexDirection="column"
      paddingVertical="xl"
      paddingHorizontal="l"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}>
      <Box justifyContent="space-between" flexDirection="row" alignItems="center">
        <Box alignItems="center" flexDirection="row" gap="s">
          <Text fontWeight={500} fontSize={16}>
            Recent Rides
          </Text>
        </Box>
        <Pressable onPress={() => router.push('/(private)/(tabs)/history')}>
          <Text color="muted" fontWeight={400} fontSize={15}>
            See all
          </Text>
        </Pressable>
      </Box>
      {rides.length <= 0 ? (
        <Box flexGrow={1} alignItems="center" justifyContent="center">
          <Image style={{ width: 140, height: 140 }} source={require('@/src/assets/empty.png')} />
          <Text>You have no recent rides.</Text>
        </Box>
      ) : (
        <Box flexGrow={1} gap="l" paddingTop="l">
          {rides.map((ride) => (
            <RideDetailsCard ride={ride} key={ride.id} />
          ))}
        </Box>
      )}
    </Box>
  );
}
