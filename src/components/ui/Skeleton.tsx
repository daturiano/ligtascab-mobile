import { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import Box from './Box';

type SkeletonProps = {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Skeleton({ width, height, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: '#e0e0e0',
          opacity,
        },
        style,
      ]}
    />
  );
}

/** A skeleton that mimics a RideDetailsCard */
export function RideCardSkeleton() {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      backgroundColor="grayLighter"
      paddingVertical="m"
      paddingHorizontal="l"
      borderRadius="l">
      <Box flexDirection="column" gap="s">
        <Skeleton width={140} height={18} />
        <Skeleton width={90} height={14} borderRadius={12} />
      </Box>
      <Box flexDirection="column" gap="s" alignItems="flex-end">
        <Skeleton width={100} height={14} />
        <Skeleton width={60} height={16} />
      </Box>
    </Box>
  );
}

/** A skeleton that mimics a HomeCard */
export function HomeCardSkeleton() {
  return (
    <Box
      flex={1}
      backgroundColor="grayLighter"
      borderRadius="l"
      height={160}
      width="48%"
      padding="l">
      <Skeleton width={100} height={18} />
    </Box>
  );
}
