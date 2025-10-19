import { useState } from 'react';
import Box from '../Box';
import Button from '../Button';
import Text from '../Text';
import ReportModal from './ReportModal';

export default function Report() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  return (
    <Box gap="s" paddingTop="l" paddingBottom="l">
      <Text variant="title" color="secondary">
        Report
      </Text>
      <Box
        flexDirection="row"
        flexWrap="wrap"
        alignItems="center"
        gap="l"
        justifyContent="space-between"
        maxWidth={'100%'}>
        <Button variant="outline" onPress={() => setIsModalVisible(!isModalVisible)}>
          <Text fontWeight={500}>Report Driver</Text>
        </Button>
        <Text variant="description" fontSize={14} fontWeight={400} flex={1} ellipsizeMode="tail">
          Once you report a driver, your location and details will also be included on the report
          details.
        </Text>
      </Box>
      {isModalVisible && <ReportModal isModalVisible setIsModalVisible={setIsModalVisible} />}
    </Box>
  );
}
