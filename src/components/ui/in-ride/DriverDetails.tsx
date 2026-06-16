import React from 'react';
import { Star } from 'lucide-react-native';
import Box from '../Box';
import Text from '../Text';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Driver, Tricycle } from '@/src/types';
import { fetchDriverRating } from '@/src/services/rides';
import { useQuery } from '@tanstack/react-query';

type DriverDetailsProps = {
  tricycle_details: Tricycle;
  driver_details: Driver;
  onRatingPress?: () => void;
};

export default function DriverDetails({
  tricycle_details,
  driver_details,
  onRatingPress,
}: DriverDetailsProps) {
  const { data: rating } = useQuery({
    queryKey: ['driverRating', driver_details.id],
    queryFn: () => fetchDriverRating(driver_details.id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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
        borderBottomWidth={1}
        paddingBottom="l">
        <Box>
          <Text variant="title">{`${driver_details.first_name} ${driver_details.last_name}`}</Text>
          <Text variant="bodyBold">{`Plate Number: ${tricycle_details.plate_number}`}</Text>
        </Box>
        <Box flexDirection="row" position="relative">
          <Image
            style={[styles.image, { left: 15, zIndex: 40 }]}
            source={require('@/src/assets/driver.jpg')}
          />
          <Image style={styles.image} source={require('@/src/assets/tricycle.png')} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onRatingPress}
            style={{
              position: 'absolute',
              left: '38%',
              zIndex: 50,
              bottom: -3,
            }}>
            <Box
              backgroundColor="white"
              borderRadius="xl"
              flexDirection="row"
              alignItems="center"
              paddingVertical="xs"
              paddingHorizontal="s"
              gap="s"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}>
              <Star fill="#000000" size={12} />
              <Text variant="bodyBold" fontSize={12}>
                {rating ? rating.toFixed(1) : '5.0'}
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderColor: '#ffffff',
    borderWidth: 4,
  },
});
