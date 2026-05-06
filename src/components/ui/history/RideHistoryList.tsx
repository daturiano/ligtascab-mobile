import { fetchRecentRidesInfiniteQuery, searchRides } from '@/src/services/rides';
import { Ride } from '@/src/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { ArrowDownUp, Filter, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { ActivityIndicator, FlatList, Pressable } from 'react-native';
import Box from '../Box';
import RideDetailsCard from '../home/RideDetailsCard';
import Input from '../Input';
import Text from '../Text';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/src/theme/theme';

interface SearchResults {
  rides: Ride[];
  hasMore: boolean;
}

type FilterType = 'all' | 'terminal' | 'e-hailing';
type SortType = 'newest' | 'oldest' | 'fare_high' | 'fare_low';

export default function RideHistoryList() {
  const theme = useTheme<Theme>();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 400);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('newest');

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
  const rawRides = pages?.flatMap((p) => p.rides) || [];
  const loading = isSearching ? isSearchLoading : isRecentLoading;
  const loadMore = isSearching ? fetchNextPage : fetchNextRecent;
  const canLoadMore = isSearching ? hasNextPage : hasMoreRecent;
  const fetchingNext = isSearching ? isFetchingNextPage : fetchingNextRecent;

  // Apply filter & sort
  const rides = useMemo(() => {
    let filtered = [...rawRides];

    // Sort
    if (activeSort === 'newest') {
      filtered.sort((a, b) => new Date(b.end_time || b.start_time).getTime() - new Date(a.end_time || a.start_time).getTime());
    } else if (activeSort === 'oldest') {
      filtered.sort((a, b) => new Date(a.end_time || a.start_time).getTime() - new Date(b.end_time || b.start_time).getTime());
    }

    return filtered;
  }, [rawRides, activeFilter, activeSort]);

  const sortOptions: { key: SortType; label: string }[] = [
    { key: 'newest', label: 'Newest' },
    { key: 'oldest', label: 'Oldest' },
  ];

  return (
    <Box flex={1} flexDirection="column" gap="m">
      <Input
        icon={Search}
        placeholder="Search by Plate Number"
        value={searchQuery}
        onChangeText={handleInputChange}
      />


      {/* Sort Chips */}
      <Box flexDirection="row" gap="s" alignItems="center">
        <ArrowDownUp size={16} color={theme.colors.muted} />
        {sortOptions.map((opt) => (
          <Pressable
            key={opt.key}
            onPress={() => setActiveSort(opt.key)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: activeSort === opt.key ? theme.colors.primaryDark : theme.colors.grayLighter,
            }}>
            <Text
              variant="details"
              color={activeSort === opt.key ? 'white' : 'muted'}
              fontSize={12}
              fontFamily="Nunito_600SemiBold">
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </Box>

      <Box flex={1}>
        {loading ? (
          <Box alignItems="center" justifyContent="center" padding="xl">
            <ActivityIndicator />
          </Box>
        ) : rides.length === 0 ? (
          <Box flexGrow={1} alignItems="center" justifyContent="center">
            <Image
              style={{ width: 140, height: 140 }}
              source={require('@/src/assets/empty-search.png')}
            />
            <Text variant="description">No rides found.</Text>
          </Box>
        ) : (
          <FlatList
            data={rides}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RideDetailsCard ride={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 120, paddingTop: 4 }}
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

