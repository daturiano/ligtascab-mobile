import { Terminal } from '@/src/types';
import { XIcon } from 'lucide-react-native';
import { Modal, TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import Button from '../Button';
import Card from '../Card';

type MarkerModalProps = {
  hasRoute: boolean;
  setRoute: (args: { latitude: number; longitude: number }[] | null) => void;
  terminal: Terminal;
  isModalVisible: boolean;
  setIsModalVisible: (args: boolean) => void;
  handleGetDirections: () => void;
};

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MarkerModal({
  hasRoute,
  setRoute,
  terminal,
  isModalVisible,
  setIsModalVisible,
  handleGetDirections,
}: MarkerModalProps) {
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
          minHeight={400}
          width="92%"
          maxWidth={380}
          flexDirection="column"
          gap="l">
          <Box flexDirection="row" justifyContent="space-between" width={'100%'}>
            <Text variant="title">Terminal Routes</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <XIcon color="#000" />
            </TouchableOpacity>
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />
          <Box flex={1} flexDirection="column" gap="l">
            {terminal.landmarks.map((landmark) => (
              <Text variant="body" key={landmark}>
                {landmark}
              </Text>
            ))}
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />
          {hasRoute ? (
            <Button
              onPress={() => {
                setRoute(null);
                setIsModalVisible(false);
              }}>
              <Text color="white" variant="bodyBold">
                Cancel Direction
              </Text>
            </Button>
          ) : (
            <Button
              onPress={() => {
                handleGetDirections();
                setIsModalVisible(false);
              }}>
              <Text color="white" variant="bodyBold">
                Get Direction
              </Text>
            </Button>
          )}
        </Card>
      </Box>
    </Modal>
  );
}
