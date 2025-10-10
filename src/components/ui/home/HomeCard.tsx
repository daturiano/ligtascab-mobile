import { Image } from 'expo-image';
import { ArrowRight, LucideIcon } from 'lucide-react-native';
import { ImageSourcePropType, Pressable } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import { useRouter } from 'expo-router';

type CardProps = {
  title: string;
  path: 'scan' | 'terminals';
  icon: LucideIcon;
  source: ImageSourcePropType;
};

export default function HomeCard({ source, path, icon: Icon, title }: CardProps) {
  const router = useRouter();
  return (
    <Box
      flexGrow={1}
      flex={1}
      borderRadius="m"
      position="relative"
      backgroundColor="white"
      overflow="hidden"
      padding="l"
      justifyContent="space-between"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        width: '48%',
      }}>
      <Pressable onPress={() => router.push(`/(private)/(tabs)/${path}`)}>
        <Box
          flexDirection="row"
          gap="s"
          alignItems="center"
          width={'100%'}
          style={{ zIndex: 2, marginBottom: 60 }}>
          <Icon size={18} />
          <Text fontWeight={500} fontSize={14}>
            {title}
          </Text>
        </Box>
        <Box
          position="absolute"
          bottom={-50}
          left={-50}
          right={0}
          alignItems="center"
          overflow="hidden">
          <Image
            source={source}
            style={{
              width: '100%',
              height: 110,
              resizeMode: 'contain',
            }}
          />
        </Box>
        <ArrowRight color={'#737373'} style={{ left: 120, top: 5 }} />
      </Pressable>
    </Box>
  );
}
