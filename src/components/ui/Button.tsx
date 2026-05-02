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
import React, { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
    }).start();
    if (rest.onPressIn) rest.onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
    if (rest.onPressOut) rest.onPressOut(e);
  };

  const handlePress = (e: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (rest.onPress) rest.onPress(e);
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }], width: '100%' }]}>
      <BaseButton 
        {...rest} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={({ pressed }) => [pressed && { opacity: 0.8 }, style]}>
        {isLoading ? <ActivityIndicator color="#ffffff" /> : children}
      </BaseButton>
    </Animated.View>
  );
};

export default Button;

