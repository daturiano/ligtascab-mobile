import { useTheme } from '@shopify/restyle';
import { LucideIcon } from 'lucide-react-native';
import { StyleProp, StyleSheet, TextInput, TextInputProps } from 'react-native';
import { Theme } from '../../theme/theme';
import Box from './Box';
import ErrorMessage from './ErrorMessage';

type ThemedInputProps = {
  style?: StyleProp<TextInput>;
  icon?: LucideIcon;
  errorMessage?: string;
} & TextInputProps;

export default function Input({ style, errorMessage, icon: Icon, ...props }: ThemedInputProps) {
  const theme = useTheme<Theme>();
  const { description, muted } = theme.colors;

  return (
    <Box width={'100%'} flexDirection="column" gap="s">
      <Box
        backgroundColor="input"
        paddingHorizontal="l"
        paddingVertical="l"
        borderRadius="m"
        flexDirection="row"
        alignItems="center"
        width={'100%'}
        gap="s">
        {Icon ? <Icon size={20} color={muted} style={[styles.icon]} /> : null}
        <TextInput placeholderTextColor={description} style={[styles.input, style]} {...props} />
      </Box>
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </Box>
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'none',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
