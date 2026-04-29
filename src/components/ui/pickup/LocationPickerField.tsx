import Box from '@/src/components/ui/Box';
import Text from '@/src/components/ui/Text';
import { useRouter } from 'expo-router';
import { CircleDot, MapPin } from 'lucide-react-native';
import { Pressable } from 'react-native';

type LocationPickerFieldProps = {
  type: 'origin' | 'destination';
  label: string;
  /** Pre-resolved address to display, or null for the "tap to select" state. */
  value: string | null;
};

export default function LocationPickerField({ type, label, value }: LocationPickerFieldProps) {
  const router = useRouter();
  const Icon = type === 'origin' ? CircleDot : MapPin;
  const iconColor = type === 'origin' ? '#1FAB89' : '#EF9651';

  return (
    <Pressable
      onPress={() => router.push(`/(private)/location-search?type=${type}` as any)}>
      {({ pressed }) => (
        <Box
          backgroundColor="input"
          paddingHorizontal="l"
          paddingVertical="l"
          borderRadius="m"
          flexDirection="row"
          alignItems="center"
          gap="m"
          opacity={pressed ? 0.7 : 1}>
          <Icon size={20} color={iconColor} strokeWidth={2.5} />
          <Box flex={1}>
            <Text variant="details">{label}</Text>
            <Text
              variant="bodyBold"
              color={value ? 'mainForeground' : 'muted'}
              numberOfLines={1}>
              {value ?? `Tap to set ${type === 'origin' ? 'pickup' : 'destination'}`}
            </Text>
          </Box>
        </Box>
      )}
    </Pressable>
  );
}
