import { useAuth } from '@/src/context/AuthenticationContext';
import {
  EmergencyAlertResult,
  sendEmergencyAlert,
  sendSafetyConfirmation,
} from '@/src/services/emergency';
import { useRideStore } from '@/src/store/useRideStore';
import { AlertTriangle, User, XIcon } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Box from '../Box';
import Button from '../Button';
import Text from '../Text';

type EmergencyModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (args: boolean) => void;
};

export default function EmergencyModal({
  isModalVisible,
  setIsModalVisible,
}: EmergencyModalProps) {
  const { user } = useAuth();
  const { rideDetails } = useRideStore();
  const [isActivated, setIsActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingSafe, setIsSendingSafe] = useState(false);
  const [alertResult, setAlertResult] = useState<EmergencyAlertResult | null>(null);

  const handleActivateEmergency = async () => {
    if (!user) return;

    setIsLoading(true);
    const result = await sendEmergencyAlert(user, rideDetails);
    setAlertResult(result);
    setIsActivated(result.success);
    setIsLoading(false);
  };

  const handleImSafe = async () => {
    if (!user) return;

    setIsSendingSafe(true);
    await sendSafetyConfirmation(user);
    setIsSendingSafe(false);
    handleClose();
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setIsActivated(false);
    setAlertResult(null);
  };

  return (
    <Modal visible={isModalVisible} transparent animationType="none" statusBarTranslucent>
      <Box flex={1} alignItems="center" justifyContent="center" backgroundColor="overlay">
        <Box
          style={styles.card}
          backgroundColor="white"
          flexDirection="column"
          padding="xl">
            {!isActivated ? (
              <>
                <Box flexDirection="row" justifyContent="space-between">
                  <Text variant="title">Emergency Assistance</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <XIcon />
                  </TouchableOpacity>
                </Box>
                <Box flex={1} justifyContent="center" alignItems="center" gap="xl">
                  <Box
                    width={100}
                    height={100}
                    borderRadius="rounded"
                    backgroundColor="warningLight"
                    justifyContent="center"
                    alignItems="center">
                    <AlertTriangle size={50} color="#ef4444" />
                  </Box>
                  <Text variant="description" textAlign="center">
                    Once you activate the emergency alert, your location and vehicle details will
                    be automatically shared with local authorities and your emergency contacts.
                  </Text>
                  <Button
                    variant="destructive"
                    onPress={handleActivateEmergency}
                    isLoading={isLoading}
                    style={styles.activateButton}>
                    <Text color="white" fontWeight={600} fontSize={16}>
                      Activate Emergency
                    </Text>
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box flexDirection="row" justifyContent="flex-end">
                  <TouchableOpacity onPress={handleClose}>
                    <XIcon />
                  </TouchableOpacity>
                </Box>
                <ScrollView
                  style={styles.scrollContent}
                  contentContainerStyle={styles.scrollContentContainer}
                  showsVerticalScrollIndicator={false}>
                  <Box alignItems="center" gap="l">
                    <Box
                      width={80}
                      height={80}
                      borderRadius="rounded"
                      backgroundColor="warningLight"
                      justifyContent="center"
                      alignItems="center">
                      <AlertTriangle size={40} color="#ef4444" />
                    </Box>
                    <Text color="warning" fontSize={24} fontWeight={700} textAlign="center">
                      EMERGENCY{'\n'}ACTIVATED
                    </Text>
                    <Text variant="description" textAlign="center" paddingHorizontal="m">
                      Your emergency alert has been sent. Local authorities and your emergency
                      contacts have been notified of your location and ride details.
                    </Text>

                    <Box width="100%" marginTop="m">
                      <Box
                        borderTopWidth={1}
                        borderColor="mutedLighter"
                        paddingTop="l"
                        width="100%">
                        <Text fontWeight={600} fontSize={16} marginBottom="m">
                          Notified Contacts:
                        </Text>
                        {alertResult?.notifiedContacts.map((contact, index) => (
                          <Box
                            key={index}
                            flexDirection="row"
                            alignItems="center"
                            gap="m"
                            marginBottom="s">
                            <User size={20} color="#374151" />
                            <Text fontWeight={600}>{contact.name}</Text>
                            {contact.name === 'Police Hotline' && (
                              <Text color="muted">(Authorities)</Text>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    <Box width="100%" paddingVertical="m">
                      <Button
                        onPress={handleImSafe}
                        isLoading={isSendingSafe}
                        style={styles.safeButton}>
                        {isSendingSafe ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text color="white" fontWeight={600} fontSize={16}>
                            {"I'm Safe Now"}
                          </Text>
                        )}
                      </Button>
                    </Box>
                  </Box>
                </ScrollView>
              </>
            )}
          </Box>
        </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 500,
    maxHeight: '80%',
    width: '92%',
    maxWidth: 380,
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  activateButton: {
    width: '100%',
    paddingVertical: 16,
  },
  safeButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#3d9d7c',
  },
});
