import { fetchRecentRidesInfiniteQuery, searchRides } from '@/src/services/rides';
import { Ride } from '@/src/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { ActivityIndicator, FlatList } from 'react-native';
import Box from '../Box';
import RideDetailsCard from '../home/RideDetailsCard';
import Input from '../Input';
import Text from '../Text';

interface SearchResults {
  rides: Ride[];
  hasMore: boolean;
}

export default function RideHistoryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 400);

  //DEFAULT QUERY
  const {
    data: recentRides,
    isLoading: isRecentLoading,
    fetchNextPage: fetchNextRecent,
    hasNextPage: hasMoreRecent,
    isFetchingNextPage: fetchingNextRecent,
  } = useInfiniteQuery({
    queryKey: ['recent_rides_history'],
    queryFn: async ({ pageParam = 0 }): Promise<SearchResults> => {
      const limit = 3;
      const offset = pageParam * limit;
      const rides = await fetchRecentRidesInfiniteQuery(offset, limit);
      const hasMore = rides.length === limit;
      return { rides, hasMore };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    enabled: !debouncedQuery.trim(),
  });

  //QUERY FOR SEARCHING
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['search_rides', debouncedQuery],
    queryFn: async ({ pageParam = 0 }): Promise<SearchResults> => {
      const rides = await searchRides(debouncedQuery, pageParam);
      const hasMore = rides.length === 3;
      return { rides, hasMore };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    enabled: !!debouncedQuery.trim(),
  });

  const handleInputChange = (text: string) => setSearchQuery(text);

  const isSearching = !!debouncedQuery.trim();
  const pages = isSearching ? searchResults?.pages : recentRides?.pages;
  const rides = pages?.flatMap((p) => p.rides) || [];
  const loading = isSearching ? isSearchLoading : isRecentLoading;
  const loadMore = isSearching ? fetchNextPage : fetchNextRecent;
  const canLoadMore = isSearching ? hasNextPage : hasMoreRecent;
  const fetchingNext = isSearching ? isFetchingNextPage : fetchingNextRecent;

  return (
    <Box flex={1} flexDirection="column" gap="m">
      <Input
        icon={Search}
        placeholder="Search by Plate Number"
        value={searchQuery}
        onChangeText={handleInputChange}
      />
      <Box
        flex={1}
        borderRadius="m"
        backgroundColor="white"
        flexDirection="column"
        paddingVertical="xl"
        paddingHorizontal="l"
        marginBottom="l"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}>
        {loading ? (
          <Box alignItems="center" justifyContent="center" padding="xl">
            <Text>Loading rides...</Text>
          </Box>
        ) : rides.length === 0 ? (
          <Box flexGrow={1} alignItems="center" justifyContent="center">
            <Image
              style={{ width: 140, height: 140 }}
              source={require('@/src/assets/empty-search.png')}
            />
            <Text>No rides found.</Text>
          </Box>
        ) : (
          <FlatList
            data={rides}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RideDetailsCard ride={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (canLoadMore && !fetchingNext) loadMore();
            }}
            ListFooterComponent={
              fetchingNext ? (
                <Box padding="m" alignItems="center">
                  <ActivityIndicator />
                </Box>
              ) : null
            }
          />
        )}
      </Box>
    </Box>
  );
}
