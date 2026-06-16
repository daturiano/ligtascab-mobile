import { Modal, TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import { XIcon } from 'lucide-react-native';
import { Ride } from '@/src/types';
import { extractTime, formatDate } from '@/src/utils/utils';
import { formatPHP } from '@/src/utils/pricing';
import Card from '../Card';

import Button from '../Button';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RideDetailsModalProps = {
  ride: Ride;
  isModalVisible: boolean;
  setIsModalVisible: (args: boolean) => void;
  onReportPress: () => void;
};

export default function RideDetailsModal({
  ride,
  isModalVisible,
  setIsModalVisible,
  onReportPress,
}: RideDetailsModalProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={isModalVisible} transparent animationType="none" statusBarTranslucent>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        backgroundColor="overlay"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}>
        <Card
          variant="elevated"
          minHeight={400}
          width="92%"
          maxWidth={380}
          flexDirection="column"
          gap="l">
          <Box flexDirection="row" justifyContent="space-between" width={'100%'}>
            <Text variant="title">Ride Details</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <XIcon color="#000" />
            </TouchableOpacity>
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />
          <Box flex={1} flexDirection="column" gap="l">
            <InfoTextBox
              title="Date"
              content={ride.end_time ? formatDate(ride.end_time.toString()) : 'In Progress'}
            />
            <InfoTextBox
              title="Driver"
              content={`${ride.driver_details.first_name} ${ride.driver_details.last_name}`}
            />
            <InfoTextBox title="Plate Number" content={`${ride.tricycle_details.plate_number}`} />
            <InfoTextBox title="Fare" content={`${formatPHP(Number(ride.fare))}`} />
            <InfoTextBox
              title="Start Time"
              content={`${extractTime(ride.created_at.toString())}`}
            />
            <InfoTextBox
              title="End Time"
              content={ride.end_time ? extractTime(ride.end_time.toString()) : 'Ongoing'}
            />
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />

          {(() => {
            const rideDate = ride.end_time ? new Date(ride.end_time) : new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const isReportable = ride.end_time && rideDate > sevenDaysAgo;

            return isReportable ? (
              <Button variant="primary" onPress={onReportPress}>
                <Text variant="bodyBold" color="white">
                  Report Issue
                </Text>
              </Button>
            ) : (
              <Text textAlign="center" variant="description">
                Rides older than 7 days cannot be reported.
              </Text>
            );
          })()}
        </Card>
      </Box>
    </Modal>
  );
}

const InfoTextBox = ({ title, content }: { title: string; content: string }) => (
  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
    <Text variant="body" color="muted">
      {title}
    </Text>
    <Text variant="bodyBold">{content}</Text>
  </Box>
);
