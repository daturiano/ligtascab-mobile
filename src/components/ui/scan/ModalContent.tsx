import { StyleSheet } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import Button from '../Button';
import { Tricycle } from '@/src/types';
import { Image } from 'expo-image';

type ModalContentProps = {
  exitModalHandler: () => void;
  onConfirm: () => void;
  tricycleDetails: Tricycle;
};

export default function ModalContent({
  onConfirm,
  tricycleDetails,
  exitModalHandler,
}: ModalContentProps) {
  return (
    <Box
      style={styles.card}
      backgroundColor="white"
      flexDirection="column"
      justifyContent="space-between">
      <Box flex={1} marginTop="xxl" flexDirection="column" alignItems="center">
        <Text variant="subheader" textAlign="center">
          {tricycleDetails.status === 'active' ? 'Confirm Your Tricycle' : 'Tricycle Is Inactive'}
        </Text>
        <Box gap="m" alignItems="center" flex={1} justifyContent="center">
          {tricycleDetails.status === 'active' ? (
            <Image
              source={require('@/src/assets/confirm.png')}
              style={{
                width: 120,
                height: 120,
              }}
            />
          ) : (
            <Image
              source={require('@/src/assets/inactive.png')}
              style={{
                width: 120,
                height: 120,
              }}
            />
          )}
          <Text variant="description">Your tricycle plate number should be:</Text>
          <Text variant="header" color="primary">
            {tricycleDetails.plate_number}
          </Text>
          <Text variant="description">
            {tricycleDetails.status === 'active'
              ? 'Are the details correct?'
              : 'This tricycle cannot be used to confirm ride.'}
          </Text>
        </Box>
      </Box>
      <Box flexDirection="column" width={'100%'} gap="s">
        {tricycleDetails.status === 'active' && (
          <Button onPress={onConfirm}>
            <Text color="mainBackground">Continue</Text>
          </Button>
        )}
        <Button variant="outline" onPress={exitModalHandler}>
          <Text>Cancel</Text>
        </Button>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 500,
    width: '92%',
    maxWidth: 380,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});
