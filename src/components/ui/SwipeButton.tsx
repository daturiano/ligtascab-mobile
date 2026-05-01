import React, { useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Text from './Text';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/src/theme/theme';

interface SwipeButtonProps {
  onComplete: () => void;
  title: string;
  icon?: React.ReactNode;
  height?: number;
}

const BUTTON_HEIGHT = 50;
const BUTTON_PADDING = 4;
const THUMB_SIZE = BUTTON_HEIGHT - BUTTON_PADDING * 2;

export default function SwipeButton({ onComplete, title, icon, height = BUTTON_HEIGHT }: SwipeButtonProps) {
  const [completed, setCompleted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const theme = useTheme<Theme>();
  const translateX = useSharedValue(0);
  const contextX = useSharedValue(0);

  const swipeableDimensions = Math.max(0, containerWidth - THUMB_SIZE - BUTTON_PADDING * 2);

  const onSwipeComplete = () => {
    setCompleted(true);
    onComplete();
    // Auto reset after 2 seconds
    setTimeout(() => {
        setCompleted(false);
        translateX.value = withSpring(0);
    }, 2000);
  };

  const pan = Gesture.Pan()
    .enabled(!completed)
    .onBegin(() => {
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      if (swipeableDimensions === 0) return;
      let newValue = contextX.value + event.translationX;
      if (newValue < 0) {
        newValue = 0;
      }
      if (newValue > swipeableDimensions) {
        newValue = swipeableDimensions;
      }
      translateX.value = newValue;
    })
    .onEnd(() => {
      if (swipeableDimensions === 0) return;
      if (translateX.value > swipeableDimensions * 0.8) {
        translateX.value = withSpring(swipeableDimensions);
        runOnJS(onSwipeComplete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const trackStyle = useAnimatedStyle(() => {
    return {
      width: THUMB_SIZE + translateX.value + BUTTON_PADDING * 2,
    };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View 
      onLayout={handleLayout}
      style={[styles.container, { height, backgroundColor: theme.colors.warningLight, borderRadius: height / 2 }]}>
      <Animated.View style={[styles.track, { height, backgroundColor: theme.colors.warning, borderRadius: height / 2 }, trackStyle]} />
      <Text style={styles.title} color={completed ? "white" : "warning"} variant="bodyBold">
        {completed ? "Alerting..." : title}
      </Text>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.thumb, { height: THUMB_SIZE, width: THUMB_SIZE, borderRadius: THUMB_SIZE / 2, backgroundColor: theme.colors.mainBackground }, animatedStyles]}>
          {icon}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    padding: BUTTON_PADDING,
    overflow: 'hidden',
  },
  track: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  title: {
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  thumb: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});
