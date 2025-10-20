import React from 'react';
import { Star } from 'lucide-react-native';
import Box from '../Box';
import Text from '../Text';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Driver, Tricycle } from '@/src/types';

type DriverDetailsProps = {
  tricycle_details: Tricycle;
  driver_details: Driver;
};

export default function DriverDetails({ tricycle_details, driver_details }: DriverDetailsProps) {
  return (
    <>
      <Text variant="title" color="secondary">
        Ride Details
      </Text>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        borderColor="grayLighter"
        borderLeftWidth={0}
        borderRightWidth={0}
        borderTopWidth={0}
        paddingBottom="xl"
        borderWidth={1}>
        <Box>
          <Text fontSize={22} fontWeight={600}>
            {`${driver_details.first_name} ${driver_details.last_name}`}
          </Text>
          <Text variant="description" fontSize={14} fontWeight={500}>
            {`Plate Number: ${tricycle_details.plate_number}`}
          </Text>
        </Box>
        <Box flexDirection="row" position="relative">
          <Image
            style={[styles.image, { left: 15, zIndex: 40 }]}
            source={require('@/src/assets/driver.jpg')}
          />
          <Image style={styles.image} source={require('@/src/assets/tricycle.png')} />
          <Box
            backgroundColor="white"
            borderRadius="xl"
            position="absolute"
            left={'38%'}
            zIndex={50}
            flexDirection="row"
            alignItems="center"
            paddingVertical="xs"
            paddingHorizontal="s"
            gap="s"
            bottom={-3}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}>
            <Star fill="#000000" size={12} />
            <Text fontWeight={600} fontSize={12}>
              4.4
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 78,
    height: 78,
    borderRadius: '50%',
    borderColor: '#ffffff',
    borderWidth: 4,
  },
});
