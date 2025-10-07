import Box from '../Box';
import BrandName from '../BrandName';
import Text from '../Text';

export default function HomeHeader() {
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
      <Box flex={1} justifyContent="center" marginBottom="l">
        <Text variant="subheader" color="white">
          Hello, Daniel Joshua! 👋
        </Text>
        <Text variant="description" color="white" fontSize={16}>
          Ready for your next safe ride?
        </Text>
      </Box>
    </Box>
  );
}
