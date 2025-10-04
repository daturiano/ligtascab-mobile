import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Box from './Box';

type ContainerProps = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export default function Container({ style, children }: ContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal="xl"
      backgroundColor="mainBackground"
      style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }, style]}>
      {children}
    </Box>
  );
}
