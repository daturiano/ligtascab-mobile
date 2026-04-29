import { Image } from 'expo-image';
import { ArrowRight, LucideIcon } from 'lucide-react-native';
import { ImageSourcePropType, Pressable } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import { useRouter } from 'expo-router';
import Card from '../Card';

type CardProps = {
  title: string;
  path: 'scan' | 'terminals' | 'pickup';
  icon: LucideIcon;
  source: ImageSourcePropType;
};

export default function HomeCard({ source, path, icon: Icon, title }: CardProps) {
  const router = useRouter();
  const href = path === 'pickup' ? '/(private)/pickup' : `/(private)/(tabs)/${path}`;
  return (
    <Card
      flexGrow={1}
      flex={1}
      padding="l"
      overflow="hidden"
      justifyContent="space-between"
      height={160}
      width="48%">
      <Pressable onPress={() => router.push(href as any)}>
        <Box
          flexDirection="row"
          gap="s"
          alignItems="center"
          width={'100%'}
          style={{ zIndex: 2, marginBottom: 60 }}>
          <Icon size={20} />
          <Text variant="bodyBold">
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
        <ArrowRight color={'#737373'} style={{ left: 120, top: 25 }} />
      </Pressable>
    </Card>
  );
}
