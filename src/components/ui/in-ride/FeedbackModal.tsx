import { submitReview } from '@/src/services/rides';
import { useRideStore } from '@/src/store/useRideStore';
import { Theme } from '@/src/theme/theme';
import { useTheme } from '@shopify/restyle';
import { Star } from 'lucide-react-native';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Box from '../Box';
import Button from '../Button';
import Text from '../Text';

type FeedbackModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  onFinish: () => void;
};

export default function FeedbackModal({ isModalVisible, setIsModalVisible, onFinish }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState('');
  
  const theme = useTheme<Theme>();
  const { rideDetails } = useRideStore();

  const handleSubmit = async () => {
    if (!rideDetails) return;
    
    setIsLoading(true);
    try {
      await submitReview({
        ride_id: rideDetails.id,
        driver_id: rideDetails.driver_details.id,
        rating,
        comment,
      });
      
      setThankYouMessage("Thank you for your feedback!\nAnd thank you for using Ligtascab!");
      setShowThankYou(true);
      
      setTimeout(() => {
        setIsModalVisible(false);
        onFinish();
      }, 1500); // Increased to 1.5s so user can actually read it
    } catch (error) {
      console.error('Failed to submit review:', error);
      // Optional: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setThankYouMessage("Thank you for using Ligtascab!");
    setShowThankYou(true);
    
    setTimeout(() => {
        setIsModalVisible(false);
        onFinish();
    }, 1000); // 1 second for skip
  };

  return (
    <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={handleSkip}>
      <TouchableWithoutFeedback onPress={showThankYou ? undefined : Keyboard.dismiss}>
        <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="overlay" padding="m">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ width: '100%', alignItems: 'center' }}
            >
                <Box
                    backgroundColor="white"
                    borderRadius="l"
                    padding="xl"
                    width="100%"
                    maxWidth={380}
                    alignItems="center"
                    gap="l"
                    style={styles.card}
                >
                    {showThankYou ? (
                        <Box paddingVertical="l" alignItems="center" gap="m">
                             <Box 
                                backgroundColor="primaryLight" 
                                padding="l" 
                                borderRadius="rounded"
                                marginBottom="s"
                             >
                                <Star size={40} color={theme.colors.primary} fill={theme.colors.primary} />
                             </Box>
                             <Text variant="subheader" textAlign="center" color="primary">Success!</Text>
                             <Text variant="body" textAlign="center" color="mainForeground">
                                {thankYouMessage}
                             </Text>
                        </Box>
                    ) : (
                        <>
                            <Text variant="subheader" textAlign="center">Rate Your Ride</Text>
                            <Text variant="body" color="muted" textAlign="center">
                                How was your experience with {rideDetails?.driver_details.first_name}?
                            </Text>

                            {/* Star Rating */}
                            <Box flexDirection="row" gap="m">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                        <Star 
                                            size={32} 
                                            fill={rating >= star ? theme.colors.secondary : 'transparent'} 
                                            color={rating >= star ? theme.colors.secondary : theme.colors.mutedLight} 
                                        />
                                    </TouchableOpacity>
                                ))}
                            </Box>

                            {/* Comment Input */}
                            <Box width="100%">
                                <TextInput
                                    style={[styles.input, { borderColor: theme.colors.mutedLighter, color: theme.colors.mainForeground }]}
                                    placeholder="Add a comment (optional)..."
                                    placeholderTextColor={theme.colors.muted}
                                    multiline
                                    numberOfLines={3}
                                    value={comment}
                                    onChangeText={setComment}
                                    textAlignVertical="top"
                                />
                            </Box>

                            {/* Actions */}
                            <Box width="100%" gap="s">
                                <Button 
                                    variant={rating > 0 ? 'primary' : 'disabled'}
                                    onPress={handleSubmit}
                                    disabled={rating === 0 || isLoading}
                                    isLoading={isLoading}
                                >
                                    <Text variant="bodyBold" color="white">Submit Feedback</Text>
                                </Button>
                                <Button variant="ghost" onPress={handleSkip}>
                                    <Text variant="bodyBold" color="muted">Skip</Text>
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </KeyboardAvoidingView>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
    card: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
        width: '100%',
        fontFamily: 'Nunito_400Regular',
    }
});
