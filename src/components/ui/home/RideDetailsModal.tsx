import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import { XIcon } from 'lucide-react-native';
import { Ride } from '@/src/types';
import { extractTime, formatDate } from '@/src/utils/utils';

type RideDetailsModalProps = {
  ride: Ride;
  isModalVisible: boolean;
  setIsModalVisible: (args: boolean) => void;
};

export default function RideDetailsModal({
  ride,
  isModalVisible,
  setIsModalVisible,
}: RideDetailsModalProps) {
  return (
    <Modal visible={isModalVisible} transparent animationType="none" statusBarTranslucent>
      <Box flex={1} alignItems="center" justifyContent="center" backgroundColor="overlay">
        <Box
          style={styles.card}
          backgroundColor="white"
          flexDirection="column"
          gap="l"
          padding="xl">
          <Box flexDirection="row" justifyContent="space-between" width={'100%'}>
            <Text variant="title">Ride Details</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <XIcon />
            </TouchableOpacity>
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />
          <Box flex={1} flexDirection="column" gap="l">
            <InfoTextBox title="Date" content={`${formatDate(ride.end_time.toLocaleString())}`} />
            <InfoTextBox
              title="Driver"
              content={`${ride.driver_details.first_name} ${ride.driver_details.last_name}`}
            />
            <InfoTextBox title="Plate Number" content={`${ride.tricycle_details.plate_number}`} />
            <InfoTextBox title="Fare" content={`${ride.fare}`} />
            <InfoTextBox
              title="Start Time"
              content={`${extractTime(ride.created_at.toLocaleString())}`}
            />
            <InfoTextBox
              title="End Time"
              content={`${extractTime(ride.end_time.toLocaleString())}`}
            />
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />
          <Text textAlign="center" variant="description">
            Rides older than 7 days cannot be reported.
          </Text>
        </Box>
      </Box>
    </Modal>
  );
}

const InfoTextBox = ({ title, content }: { title: string; content: string }) => (
  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
    <Text variant="body" color="muted">
      {title}
    </Text>
    <Text variant="body">{content}</Text>
  </Box>
);

const styles = StyleSheet.create({
  card: {
    minHeight: 400,
    width: '92%',
    maxWidth: 380,
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});
