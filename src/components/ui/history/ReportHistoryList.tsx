import { fetchReportsInfiniteQuery } from '@/src/services/db';
import { Report } from '@/src/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import Box from '../Box';
import Text from '../Text';
import { Image } from 'expo-image';
import { ActivityIndicator, FlatList } from 'react-native';
import ReportDetailsCard from './ReportDetailsCard';

interface SearchResults {
  reports: Report[];
  hasMore: boolean;
}

export default function ReportHistoryList() {
  const {
    data: report_history,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['report_history'],
    queryFn: async ({ pageParam = 0 }): Promise<SearchResults> => {
      const limit = 3;
      const offset = pageParam * limit;
      const reports = await fetchReportsInfiniteQuery(offset, limit);
      const hasMore = reports.length === limit;
      return { reports, hasMore };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
  });

  const reports = report_history?.pages?.flatMap((p) => p.reports) || [];

  return (
    <Box flex={1} flexDirection="column" gap="m">
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
        {isLoading ? (
          <Box alignItems="center" justifyContent="center" padding="xl">
            <ActivityIndicator />
          </Box>
        ) : reports.length === 0 ? (
          <Box flexGrow={1} alignItems="center" justifyContent="center">
            <Image
              style={{ width: 140, height: 140 }}
              source={require('@/src/assets/empty-report.png')}
            />
            <Text>No reports found.</Text>
          </Box>
        ) : (
          <Box gap="m">
            <Text variant="title">Report Summary</Text>
            <FlatList
              data={reports}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ReportDetailsCard report={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
              onEndReachedThreshold={0.2}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
              }}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <Box padding="m" alignItems="center">
                    <ActivityIndicator />
                  </Box>
                ) : null
              }
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
