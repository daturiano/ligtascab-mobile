import { useState } from 'react';
import Box from '../Box';
import Button from '../Button';
import Text from '../Text';
import ReportModal from './ReportModal';
import { ShieldAlert } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/src/theme/theme';

export default function Report() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const theme = useTheme<Theme>();

  return (
    <>
      <Button
        variant="outline"
        paddingVertical="m"
        onPress={() => setIsModalVisible(true)}
        style={{ borderColor: theme.colors.muted, borderWidth: 1 }}>
        <Box alignItems="center" gap="s" flexDirection="row" justifyContent="center">
          <ShieldAlert size={20} color={theme.colors.mainForeground} />
          <Text variant="bodyBold" color="mainForeground">
            Report
          </Text>
        </Box>
      </Button>
      {isModalVisible && <ReportModal isModalVisible setIsModalVisible={setIsModalVisible} />}
    </>
  );
}
