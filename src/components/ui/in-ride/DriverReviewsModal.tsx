import { fetchDriverReviews } from '@/src/services/rides';
import { Theme } from '@/src/theme/theme';
import { Review } from '@/src/types';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@shopify/restyle';
import { Star, X } from 'lucide-react-native';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';

type DriverReviewsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  driverId: string;
  driverName: string;
};

export default function DriverReviewsModal({
  isVisible,
  onClose,
  driverId,
  driverName,
}: DriverReviewsModalProps) {
  const theme = useTheme<Theme>();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['driverReviews', driverId],
    queryFn: () => fetchDriverReviews(driverId),
    enabled: isVisible,
  });

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <Box flex={1} backgroundColor="overlay" justifyContent="flex-end">
        <Box
          backgroundColor="mainBackground"
          borderTopLeftRadius="xl"
          borderTopRightRadius="xl"
          height="70%"
          padding="l">
          {/* Header */}
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="l">
            <Box>
              <Text variant="subheader" color="mainForeground">
                Reviews
              </Text>
              <Text variant="body" color="muted">
                for {driverName}
              </Text>
            </Box>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <X color={theme.colors.mainForeground} size={24} />
            </TouchableOpacity>
          </Box>

          {/* Content */}
          {isLoading ? (
            <Box flex={1} justifyContent="center" alignItems="center">
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </Box>
          ) : (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}>
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <Box
                    key={review.id}
                    backgroundColor="white"
                    borderRadius="l"
                    padding="m"
                    marginBottom="m"
                    style={styles.card}>
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      marginBottom="s">
                      <Text variant="bodyBold" color="mainForeground">
                        Anonymous Commuter
                      </Text>
                      <Text variant="details" color="muted">
                        {formatDate(review.created_at)}
                      </Text>
                    </Box>
                    <Box flexDirection="row" marginBottom="s" gap="xs">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          fill={review.rating >= star ? theme.colors.secondary : 'transparent'}
                          color={
                            review.rating >= star ? theme.colors.secondary : theme.colors.mutedLight
                          }
                        />
                      ))}
                    </Box>
                    {review.comment ? (
                      <Text variant="body" color="mainForeground">
                        {review.comment}
                      </Text>
                    ) : (
                      <Text variant="details" color="muted" fontStyle="italic">
                        No comment provided
                      </Text>
                    )}
                  </Box>
                ))
              ) : (
                <Box marginTop="xl" alignItems="center">
                  <Text variant="body" color="muted" textAlign="center">
                    No reviews yet for this driver.
                  </Text>
                </Box>
              )}
            </ScrollView>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
