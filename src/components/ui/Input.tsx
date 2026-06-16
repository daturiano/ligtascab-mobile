import { useTheme } from '@shopify/restyle';
import { LucideIcon } from 'lucide-react-native';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Theme } from '../../theme/theme';
import Box from './Box';
import ErrorMessage from './ErrorMessage';
import Text from './Text';
import { useState } from 'react';

type ThemedInputProps = {
  style?: StyleProp<TextStyle>;
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
  errorMessage?: string | null;
  title?: string;
  onPress?: () => void;
} & TextInputProps;

export default function Input({
  style,
  errorMessage,
  title,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconPress,
  onPress,
  ...props
}: ThemedInputProps) {
  const theme = useTheme<Theme>();
  const { description, muted, primary, warning } = theme.colors;
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (errorMessage) return 'warning';
    if (isFocused) return 'primary';
    return 'input'; // transparent or match background
  };

  const InputContent = (
    <Box
      backgroundColor="input"
      paddingHorizontal="l"
      paddingVertical="l"
      borderRadius="m"
      borderWidth={1}
      borderColor={getBorderColor()}
      flexDirection="row"
      alignItems="center"
      width={'100%'}
      gap="s">
      {Icon ? <Icon size={20} color={isFocused ? primary : muted} style={[styles.icon]} /> : null}
      <TextInput
        placeholderTextColor={description}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        style={[styles.input, style]}
        editable={!onPress} // Disable editing if onPress is provided
        pointerEvents={onPress ? 'none' : 'auto'} // Pass clicks through if onPress is provided
        {...props}
      />
      {RightIcon ? (
        <TouchableOpacity onPress={onRightIconPress}>
          <RightIcon size={20} color={muted} />
        </TouchableOpacity>
      ) : null}
    </Box>
  );

  return (
    <Box width={'100%'} flexDirection="column" gap="s">
      {title && <Text variant="body">{title}</Text>}
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          {InputContent}
        </TouchableOpacity>
      ) : (
        InputContent
      )}
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
    fontFamily: 'Nunito_300Light',
  },
});
