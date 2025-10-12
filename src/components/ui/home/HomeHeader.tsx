import Box from '../Box';
import BrandName from '../BrandName';
import Text from '../Text';

type HomeHeaderProps = {
  title?: string;
  description?: string;
};

export default function HomeHeader({ title, description }: HomeHeaderProps) {
  return (
    <Box
      width={'100%'}
      paddingTop="_4xl"
      height={250}
      flexDirection="column"
      paddingHorizontal="l"
      justifyContent="space-between"
      backgroundColor="primary"
      borderBottomEndRadius="m"
      position="absolute"
      borderBottomStartRadius="m">
      <BrandName variant="light" />
      {title && (
        <Box flex={1} justifyContent="center" marginBottom="l">
          <Text variant="subheader" color="white">
            {title}
          </Text>
          <Text variant="description" color="white" fontSize={16}>
            {description}
          </Text>
        </Box>
      )}
    </Box>
  );
}
