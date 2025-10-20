import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import ErrorMessage from '@/src/components/ui/ErrorMessage';
import Text from '@/src/components/ui/Text';
import { useRide } from '@/src/context/RideContext';
import { ReportSchema } from '@/src/schemas';
import { Theme } from '@/src/theme/theme';
import { violationOptions } from '@/src/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@shopify/restyle';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as z from 'zod';
import ReportMsg from '../ui/in-ride/ReportMsg';
import { submitReport } from '@/src/services/rides';

export default function ReportForm() {
  const { rideDetails, setReportDetails } = useRide();
  const theme = useTheme<Theme>();
  const { mutedLighter } = theme.colors;
  const [showDropdown, setShowDropdown] = useState(false);

  const generateTicketNumber = () => {
    const firstId = rideDetails?.id.slice(0, 5).toUpperCase();
    const secondId = rideDetails?.id.slice(6, 9).toUpperCase();
    return `TRC-${firstId}-${secondId}`;
  };

  const ticketNumber = generateTicketNumber();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm<z.infer<typeof ReportSchema>>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      type: '',
      description: '',
      ticket_number: ticketNumber,
      ride_id: rideDetails!.id,
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: z.infer<typeof ReportSchema>) => {
    try {
      const report = await submitReport(data);
      if (report) {
        setReportDetails(report);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError('root', {
        type: 'manual',
        message: err.message ?? 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <Box gap="xl" flex={1} flexDirection="column" justifyContent="space-between">
      <Text variant="description">
        Help us improve the service by reporting any issues with your ride.
      </Text>
      <Box gap="m" flex={1} flexDirection="column" justifyContent="space-between">
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <Box gap="s">
              <Text variant="body">Type of Violation</Text>
              <TouchableOpacity
                style={[styles.dropdownBtn, { borderColor: mutedLighter, position: 'relative' }]}
                onPress={() => setShowDropdown(!showDropdown)}>
                <Text variant="description">
                  {value
                    ? violationOptions.find((option) => option.id === value)?.label
                    : 'Select Violation'}
                </Text>
                {showDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </TouchableOpacity>
              {showDropdown && (
                <ScrollView
                  style={[styles.dropdownContainer, { borderColor: mutedLighter }]}
                  nestedScrollEnabled>
                  {violationOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[styles.optionsBtn, { borderColor: mutedLighter }]}
                      onPress={() => {
                        onChange(option.id);
                        setShowDropdown(false);
                      }}>
                      <Text variant="description">{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </Box>
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Box gap="s">
              <Text variant="body">Describe the Issue in Details*</Text>
              <TextInput
                style={[styles.textInputContainer, { borderColor: mutedLighter, fontSize: 14 }]}
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={6}
                maxLength={1000}
                textAlignVertical="top"
              />
            </Box>
          )}
        />
        <ReportMsg />
        {errors.root?.message && <ErrorMessage message={errors.root.message} />}
      </Box>
      <Button
        onPress={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        disabled={!isValid || isSubmitting}
        variant={!isValid ? 'disabled' : 'primary'}>
        <Text color="mainBackground" variant="body">
          Submit
        </Text>
      </Button>
    </Box>
  );
}

const styles = StyleSheet.create({
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 85,
    width: '100%',
    zIndex: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 147,
  },
  optionsBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
  },
});
