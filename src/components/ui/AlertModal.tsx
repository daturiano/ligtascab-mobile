import { Modal, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/src/theme/theme';
import Box from './Box';
import Text from './Text';
import Button from './Button';
import { AlertCircle } from 'lucide-react-native';

type AlertModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  variant?: 'success' | 'error' | 'info' | 'warning';
};

export default function AlertModal({ visible, title, message, onClose, variant = 'warning' }: AlertModalProps) {
  const theme = useTheme<Theme>();

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <AlertCircle size={48} color={theme.colors.primary} />;
      case 'error':
        return <AlertCircle size={48} color={theme.colors.warning} />;
      case 'warning':
        return <AlertCircle size={48} color={theme.colors.secondary} />; // Orange/Yellow
      default:
        return <AlertCircle size={48} color={theme.colors.primary} />;
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Box flex={1} justifyContent="center" alignItems="center" padding="l">
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="overlay"
        />
        <Box
          backgroundColor="mainBackground"
          borderRadius="xl"
          width="100%"
          maxWidth={320}
          padding="xl"
          gap="m"
          alignItems="center"
          style={styles.shadow}>
          
          <Box marginBottom="s">
            {getIcon()}
          </Box>

          <Text variant="subheader" textAlign="center">
            {title}
          </Text>
          <Text variant="body" textAlign="center" color="muted">
            {message}
          </Text>
          <Button onPress={onClose} paddingVertical="s" marginTop="s" width="100%">
            <Text variant="bodyBold" color="white" textAlign="center">
              Okay
            </Text>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
