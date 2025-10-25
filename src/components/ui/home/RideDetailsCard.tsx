import { Ride } from '@/src/types';
import { formatDate } from '@/src/utils/utils';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import RideDetailsModal from './RideDetailsModal';

export default function RideDetailsCard({ ride }: { ride: Ride }) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width={'100%'}
        backgroundColor="primaryLighter"
        paddingVertical="m"
        paddingHorizontal="l"
        borderRadius="l">
        <Box flexDirection="column" gap="s">
          <Text fontSize={16} fontWeight={400}>
            {ride.driver_details.first_name} {ride.driver_details.last_name}
          </Text>
          <Text variant="description" fontSize={14} color="muted" fontWeight={400}>
            {ride.tricycle_details.plate_number}
          </Text>
        </Box>
        <Box flexDirection="column" gap="s">
          <Text variant="body" textAlign="right" fontWeight={400}>
            ₱{ride.fare}
          </Text>
          <Text variant="description" fontSize={14} color="muted" fontWeight={400}>
            {formatDate(ride.end_time.toLocaleString())}
          </Text>
        </Box>
      </Box>
      {isModalVisible && (
        <RideDetailsModal ride={ride} isModalVisible setIsModalVisible={setIsModalVisible} />
      )}
    </TouchableOpacity>
  );
}
