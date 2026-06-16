import { TriangleAlert } from 'lucide-react-native';
import Box from '../Box';
import Button from '../Button';
import Text from '../Text';
import { useState } from 'react';
import EmergencyModal from './EmergencyModal';

export default function EmergencyButton() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <>
      <Button variant="destructive" paddingVertical="m" onPress={() => setIsModalVisible(true)}>
        <Box alignItems="center" gap="s" flexDirection="row" justifyContent="center">
          <TriangleAlert color={'#ffffff'} size={20} />
          <Text color="white" variant="bodyBold">
            Emergency
          </Text>
        </Box>
      </Button>
      {isModalVisible && <EmergencyModal isModalVisible setIsModalVisible={setIsModalVisible} />}
    </>
  );
}
