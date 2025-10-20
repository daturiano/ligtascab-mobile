import { createNewRide } from '@/src/services/rides';
import { useRideStore } from '@/src/store/useRideStore';
import { Tricycle } from '@/src/types';
import { getErrorMessage } from '@/src/utils/utils';
import { useMutation } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Modal, StyleSheet } from 'react-native';
import Box from '../Box';
import Button from '../Button';
import Text from '../Text';

type OnScanModalProps = {
  visible: boolean;
  tricycle_details: Tricycle;
  exitModalHandler: () => void;
};

export default function OnScanModal({
  visible,
  exitModalHandler,
  tricycle_details,
}: OnScanModalProps) {
  const router = useRouter();
  const { setRideDetails } = useRideStore();

  const createRideMutation = useMutation({
    mutationFn: async (data: Tricycle) => createNewRide(tricycle_details),
  });

  const onConfirm = async () => {
    try {
      const rideDetails = await createRideMutation.mutateAsync(tricycle_details);
      setRideDetails(rideDetails);
      exitModalHandler();
      router.push({
        pathname: '/(private)/in-ride',
      });
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Box flex={1} alignItems="center" justifyContent="center" backgroundColor="overlay">
        <Box
          style={styles.card}
          backgroundColor="white"
          flexDirection="column"
          justifyContent="space-between">
          <Box flex={1} marginTop="xxl" flexDirection="column" alignItems="center">
            <Text variant="subheader" textAlign="center">
              {tricycle_details.status === 'active'
                ? 'Confirm Your Tricycle'
                : 'Tricycle Is Inactive'}
            </Text>
            <Box gap="m" alignItems="center" flex={1} justifyContent="center">
              {tricycle_details.status === 'active' ? (
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
                {tricycle_details.plate_number}
              </Text>
              <Text variant="description">
                {tricycle_details.status === 'active'
                  ? 'Are the details correct?'
                  : 'This tricycle cannot be used to confirm ride.'}
              </Text>
            </Box>
          </Box>
          <Box flexDirection="column" width={'100%'} gap="s">
            {tricycle_details.status === 'active' && (
              <Button onPress={onConfirm}>
                <Text color="mainBackground">Continue</Text>
              </Button>
            )}
            <Button variant="outline" onPress={exitModalHandler}>
              <Text>Cancel</Text>
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
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
