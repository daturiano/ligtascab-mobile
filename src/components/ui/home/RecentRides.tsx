import { fetchRecentRides } from '@/src/services/rides';
import { Ride } from '@/src/types';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { FlatList, Pressable, Dimensions } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import RideDetailsCard from './RideDetailsCard';
import { useRouter } from 'expo-router';
import { RideCardSkeleton } from '../Skeleton';

const CARD_WIDTH = Dimensions.get('window').width * 0.78;

export default function RecentRides() {
  const router = useRouter();

  const { data: recent_rides, isLoading } = useQuery<Ride[]>({
    queryKey: ['recent_rides'],
    queryFn: fetchRecentRides,
  });

  const rides = recent_rides?.flatMap((p) => p) || [];

  return (
    <Box flexDirection="column" gap="m">
      <Box justifyContent="space-between" flexDirection="row" alignItems="center" paddingHorizontal="l">
        <Text variant="bodyBold">Recent Rides</Text>
        <Pressable onPress={() => router.push('/(private)/(tabs)/history')}>
          <Text color="muted" fontWeight={400} variant="body" fontSize={15}>
            See all
          </Text>
        </Pressable>
      </Box>
      {isLoading ? (
        <Box paddingHorizontal="l" gap="m">
          <RideCardSkeleton />
          <RideCardSkeleton />
        </Box>
      ) : rides.length <= 0 ? (
        <Box alignItems="center" justifyContent="center" padding="xl">
          <Image style={{ width: 140, height: 140 }} source={require('@/src/assets/empty.png')} />
          <Text variant="description">You have no recent rides.</Text>
        </Box>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 12}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item }) => (
            <Box width={CARD_WIDTH}>
              <RideDetailsCard ride={item} />
            </Box>
          )}
        />
      )}
    </Box>
  );
}


