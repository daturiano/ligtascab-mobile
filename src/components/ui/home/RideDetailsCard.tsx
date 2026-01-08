import { Ride } from '@/src/types';
import { formatDate } from '@/src/utils/utils';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import RideDetailsModal from './RideDetailsModal';
import ReportModal from '../in-ride/ReportModal';

export default function RideDetailsCard({ ride }: { ride: Ride }) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isReportVisible, setIsReportVisible] = useState<boolean>(false);

  const handleReportPress = () => {
    setIsModalVisible(false);
    setTimeout(() => {
        setIsReportVisible(true);
    }, 300); // Small delay for smoother transition
  };

  return (
    <>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            width={'100%'}
            backgroundColor="primary"
            paddingVertical="m"
            paddingHorizontal="l"
            borderRadius="l">
            <Box flexDirection="column" gap="xs">
            <Text color="white" variant="bodyBold" fontSize={18}>
                {ride.driver_details.first_name} {ride.driver_details.last_name}
            </Text>
            <Box
                backgroundColor="grayLight"
                paddingHorizontal="m"
                style={{ paddingVertical: .5 }}
                borderRadius="rounded"
                alignSelf="flex-start">
                <Text variant="bodyBold" color="primary" fontSize={12}>
                {ride.tricycle_details.plate_number}
                </Text>
            </Box>
            </Box>
            <Box flexDirection="column" gap="xs">
            <Text variant="details" color="white">
                {ride.end_time ? formatDate(ride.end_time.toLocaleString()) : ''}
            </Text>
            <Text variant="body" textAlign="right" color="white">
                ₱{ride.fare}
            </Text>
            </Box>
        </Box>
        </TouchableOpacity>

        <RideDetailsModal 
            ride={ride} 
            isModalVisible={isModalVisible} 
            setIsModalVisible={setIsModalVisible} 
            onReportPress={handleReportPress}
        />

        <ReportModal 
            ride={ride}
            isModalVisible={isReportVisible}
            setIsModalVisible={setIsReportVisible}
        />
    </>
  );
}
