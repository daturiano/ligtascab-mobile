import { ShieldCheck, AlertTriangle, Eye, Phone } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions } from 'react-native';
import Box from '../Box';
import Text from '../Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TIPS = [
  {
    icon: ShieldCheck,
    title: 'Verify Your Ride',
    text: 'Always double-check the body number on the app with the physical tricycle before boarding.',
    bg: '#e8f5f1',
    color: '#1FAB89',
  },
  {
    icon: AlertTriangle,
    title: 'Share Your Trip',
    text: 'Let a friend or family member know your route and expected arrival time for every ride.',
    bg: '#fef3e2',
    color: '#EF9651',
  },
  {
    icon: Eye,
    title: 'Stay Alert',
    text: 'Be aware of your surroundings. Avoid wearing headphones or looking at your phone during the ride.',
    bg: '#eef0ff',
    color: '#5B6AE8',
  },
  {
    icon: Phone,
    title: 'Emergency Ready',
    text: 'Use the SOS button during a ride if you feel unsafe. It will alert authorities with your live location.',
    bg: '#fde8e8',
    color: '#E85B5B',
  },
];

const INTERVAL_MS = 5000;

export default function SafetyTip() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out + slide left
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveIndex((prev) => (prev + 1) % TIPS.length);
        // Reset position to right side
        slideAnim.setValue(30);
        // Slide in from right + fade in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: 14,
          }),
        ]).start();
      });
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fadeAnim, slideAnim]);

  const tip = TIPS[activeIndex];
  const Icon = tip.icon;

  return (
    <Box
      borderRadius="l"
      marginBottom="l"
      marginHorizontal="l"
      overflow="hidden"
      style={{ backgroundColor: tip.bg }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <Box flexDirection="row" alignItems="flex-start" gap="m">
          <Box
            style={{
              backgroundColor: tip.color,
              borderRadius: 999,
              padding: 8,
              marginTop: 2,
            }}>
            <Icon size={18} color="#ffffff" />
          </Box>
          <Box flex={1} gap="xs">
            <Text variant="bodyBold" style={{ color: tip.color }}>
              {tip.title}
            </Text>
            <Text variant="details" color="description" lineHeight={20}>
              {tip.text}
            </Text>
          </Box>
        </Box>
      </Animated.View>

      {/* Dot indicators */}
      <Box flexDirection="row" justifyContent="center" gap="s" paddingBottom="m">
        {TIPS.map((_, idx) => (
          <Box
            key={idx}
            style={{
              width: activeIndex === idx ? 18 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: activeIndex === idx ? tip.color : '#c5c5c5',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
