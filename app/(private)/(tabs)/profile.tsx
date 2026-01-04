import Box from '@/src/components/ui/Box';
import Container from '@/src/components/ui/Container';
import HomeHeader from '@/src/components/ui/home/HomeHeader';
import Text from '@/src/components/ui/Text';

export default function Profile() {
  return (
    <Container style={{ paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }}>
      <Box
        width="100%"
        height={170}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="l"
        backgroundColor="primary">
        <Box marginTop="xl" padding="l" borderRadius="rounded" backgroundColor="white">
          <Text color="primaryDark" fontSize={32} fontWeight={600}>
            DT
          </Text>
        </Box>
        <Box>
          <Text>Daniel Joshua Turiano</Text>
        </Box>
      </Box>
    </Container>
  );
}
