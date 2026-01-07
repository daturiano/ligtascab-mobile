import { Theme } from '@/src/theme/theme';
import {
  backgroundColor,
  BackgroundColorProps,
  createRestyleComponent,
  createVariant,
  spacing,
  SpacingProps,
  VariantProps,
} from '@shopify/restyle';
import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

type ButtonProps = SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, 'buttonVariants'> &
  PressableProps & {
    children: React.ReactNode;
    isLoading?: boolean;
    style?: StyleProp<ViewStyle>;
  };

const BaseButton = createRestyleComponent<ButtonProps, Theme>(
  [spacing, backgroundColor, createVariant({ themeKey: 'buttonVariants' })],
  Pressable
);

const Button = ({ style, children, isLoading = false, ...rest }: ButtonProps) => {
  return (
    <BaseButton {...rest} style={({ pressed }) => [pressed && { opacity: 0.5 }, style]}>
      {isLoading ? <ActivityIndicator color="#737373" /> : children}
    </BaseButton>
  );
};

export default Button;

