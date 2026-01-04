import { TriangleAlert } from 'lucide-react-native';
import Box from '../Box';
import Button from '../Button';
import Text from '../Text';
import { useState } from 'react';
import EmergencyModal from './EmergencyModal';

export default function EmergencyButton() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  return (
    <Button
      style={{ position: 'absolute', bottom: 405, marginLeft: 12, zIndex: 0 }}
      variant="destructive"
      onPress={() => setIsModalVisible(!isModalVisible)}>
      <Box alignItems="center" gap="s" flexDirection="row">
        <TriangleAlert color={'#ffffff'} size={20} />
        <Text color="white" fontWeight={600}>
          Emergency
        </Text>
      </Box>
      {isModalVisible && <EmergencyModal isModalVisible setIsModalVisible={setIsModalVisible} />}
    </Button>
  );
}
