import { Theme } from '@/src/theme/theme';
import { useTheme } from '@shopify/restyle';
import { CircleAlert } from 'lucide-react-native';
import Box from './Box';
import Text from './Text';

type ErrorMessageProps = {
  size?: number;
  message: string;
};

const ErrorMessage = ({ size = 14, message }: ErrorMessageProps) => {
  const theme = useTheme<Theme>();
  const { warning } = theme.colors;
  return (
    <Box flexDirection="row" alignItems="center" gap="s">
      <CircleAlert size={size} color={warning} />
      <Text variant="description" fontSize={size} color="warning">
        {message}
      </Text>
    </Box>
  );
};

export default ErrorMessage;
