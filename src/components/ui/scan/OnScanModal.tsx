import { useRide } from '@/src/context/RideContext';
import { createNewRide } from '@/src/services/rides';
import { Tricycle } from '@/src/types';
import { getErrorMessage } from '@/src/utils/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Modal } from 'react-native';
import Box from '../Box';
import ModalContent from './ModalContent';

type OnScanModalProps = {
  visible: boolean;
  isLoading: boolean;
  exitModalHandler: () => void;
};

export default function OnScanModal({ visible, isLoading, exitModalHandler }: OnScanModalProps) {
  const router = useRouter();
  const { tricycleDetails, setRideDetails } = useRide();

  const createRideMutation = useMutation({
    mutationFn: async (data: Tricycle) => createNewRide(tricycleDetails!),
  });

  const onConfirm = async () => {
    try {
      const rideDetails = await createRideMutation.mutateAsync(tricycleDetails!);
      setRideDetails(rideDetails);
      exitModalHandler();
      router.push({
        pathname: '/(private)/in-ride',
      });
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  };

  if (!tricycleDetails) return null;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Box flex={1} alignItems="center" justifyContent="center" backgroundColor="overlay">
        {isLoading && <ActivityIndicator />}
        {tricycleDetails && (
          <ModalContent
            exitModalHandler={exitModalHandler}
            onConfirm={onConfirm}
            tricycleDetails={tricycleDetails}
          />
        )}
      </Box>
    </Modal>
  );
}
