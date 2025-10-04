import { Image } from 'expo-image';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Box from './Box';
import Text from './Text';

type BrandNameProps = {
  style?: StyleProp<ViewStyle>;
};

export default function BrandName({ style }: BrandNameProps) {
  return (
    <Box style={[{ width: '100%' }, style]} flexDirection="row" alignItems="center" gap="s">
      <Image style={styles.image} source={require('@/src/assets/logo.svg')} />
      <Text
        style={[styles.brandName, { fontFamily: 'Nunito_800ExtraBold' }]}
        fontSize={28}
        color="primary">
        ligtascab.
      </Text>
    </Box>
  );
}

const styles = StyleSheet.create({
  brandName: {
    letterSpacing: -1.8,
  },
  image: {
    width: 26,
    height: 26,
  },
});
