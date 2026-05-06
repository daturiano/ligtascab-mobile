import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import ErrorMessage from '@/src/components/ui/ErrorMessage';
import Text from '@/src/components/ui/Text';
import { ReportSchema } from '@/src/schemas';
import { submitReport } from '@/src/services/rides';
import { Theme } from '@/src/theme/theme';
import { Report, Ride } from '@/src/types';
import { violationOptions } from '@/src/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@shopify/restyle';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import * as z from 'zod';
import ReportMsg from '../ui/in-ride/ReportMsg';

type ReportFormProps = {
  rideDetails: Ride;
  setReportDetails: (args: Report | null) => void;
};

export default function ReportForm({ rideDetails, setReportDetails }: ReportFormProps) {
  const theme = useTheme<Theme>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateTicketNumber = () => {
    const firstId = rideDetails?.id.slice(0, 5).toUpperCase();
    const secondId = rideDetails?.id.slice(9, 12).toUpperCase();
    return `TRC-${firstId}-${secondId}`;
  };

  const ticketNumber = generateTicketNumber();

  const {
    control,
    getValues,
    trigger,
    formState: { errors, isValid },
    setError,
    setValue,
  } = useForm<z.infer<typeof ReportSchema>>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      type: '',
      description: '',
      ticket_number: ticketNumber,
      ride_id: rideDetails!.id,
    },
    mode: 'onChange',
  });

  const onSubmit = async () => {
    const valid = await trigger();
    if (!valid) return;

    const data = getValues();
    setIsLoading(true);
    try {
      const report = await submitReport(data);
      if (report) {
        setReportDetails(report);
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      console.error('Report submission failed:', err);
      setError('root', {
        type: 'manual',
        message: err.message ?? 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <Box gap="l" flexDirection="column" width="100%">
      <Text variant="description">
        Help us improve the service by reporting any issues with your ride.
      </Text>
      
      <Box gap="m" width="100%">
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <Box gap="s">
              <Text variant="bodyBold">Type of Violation</Text>
              <TouchableOpacity
                style={[styles.dropdownBtn, { borderColor: theme.colors.mutedLighter }]}
                onPress={() => setShowDropdown(true)}>
                <Text variant="body" color={value ? 'mainForeground' : 'muted'}>
                  {value
                    ? violationOptions.find((option) => option.id === value)?.label
                    : 'Select Violation'}
                </Text>
                <ChevronDown size={18} color={theme.colors.mainForeground} />
              </TouchableOpacity>
              
              {/* Modal Picker for Violation Options */}
              <Modal
                visible={showDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
              >
                  <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={() => setShowDropdown(false)}
                  >
                    <Box 
                        backgroundColor="white" 
                        width="85%" 
                        maxHeight="60%" 
                        borderRadius="l" 
                        padding="m"
                        style={{ elevation: 5 }}
                    >
                        <Text variant="subheader" textAlign="center" marginBottom="m">Select Violation</Text>
                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                             {violationOptions.map((option) => (
                                <TouchableOpacity
                                  key={option.id}
                                  style={{ 
                                      paddingVertical: 16, 
                                      paddingHorizontal: 12,
                                      borderBottomWidth: 1, 
                                      borderBottomColor: theme.colors.grayLighter,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                  }}
                                  onPress={() => {
                                    onChange(option.id);
                                    setShowDropdown(false);
                                  }}>
                                  <Text variant="body" color={value === option.id ? 'primary' : 'mainForeground'}>
                                    {option.label}
                                  </Text>
                                  {value === option.id && <Box width={10} height={10} borderRadius="rounded" backgroundColor="primary" />}
                                </TouchableOpacity>
                              ))}
                        </ScrollView>
                        <Button variant="ghost" onPress={() => setShowDropdown(false)} marginTop="s">
                            <Text variant="bodyBold" color="muted">Cancel</Text>
                        </Button>
                    </Box>
                  </TouchableOpacity>
              </Modal>
            </Box>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Box gap="s">
              <Text variant="bodyBold">Describe the Issue*</Text>
              <TextInput
                style={[styles.textInputContainer, { borderColor: theme.colors.mutedLighter, color: theme.colors.mainForeground }]}
                value={value}
                onChangeText={onChange}
                placeholder="Please describe what happened..."
                placeholderTextColor={theme.colors.muted}
                multiline
                numberOfLines={4}
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
        onPress={onSubmit}
        isLoading={isLoading}
        disabled={!isValid || isLoading}
        variant={!isValid ? 'disabled' : 'primary'}>
        <Text color="white" variant="bodyBold">
          Submit Report
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
    backgroundColor: '#fff',
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
