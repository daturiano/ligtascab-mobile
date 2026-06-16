import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Container from '@/src/components/ui/Container';
import Input from '@/src/components/ui/Input';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { supabase } from '@/src/utils/supabase';
import { useRouter } from 'expo-router';
import { Calendar, LogOut, Mail, MapPin, Phone, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Profile() {
  const { user, signOutUser, isEmailVerified } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    birth_date: '',
    contact_person: '',
    contact_person_number: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        birth_date: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '',
        contact_person: user.contact_person || '',
        contact_person_number: user.contact_person_number || '',
      });
    }
  }, [user]);

  const handleVerifyEmail = async () => {
    if (!user?.email) {
      Alert.alert('Error', 'No email address found.');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      if (error) throw error;
      Alert.alert('Sent!', 'A verification email has been sent to ' + user.email);
    } catch (error: any) {
      Alert.alert('Notice', 'Could not send verification email. ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('commuters')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          address: formData.address,
          birth_date: formData.birth_date || null,
          contact_person: formData.contact_person || null,
          contact_person_number: formData.contact_person_number || null,
        })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      } else {
        // Sync email with Supabase Auth
        if (formData.email && formData.email !== user.email) {
          const { error: authError } = await supabase.auth.updateUser({ email: formData.email });
          if (!authError) {
            Alert.alert(
              'Success',
              'Profile updated. A verification link has also been sent to your new email address.'
            );
          } else {
            Alert.alert(
              'Success',
              'Profile updated, but failed to sync email to account settings: ' + authError.message
            );
          }
        } else {
          Alert.alert('Success', 'Profile updated successfully.');
        }

        setIsEditing(false);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await signOutUser();
          router.replace('/(authentication)/login');
        },
      },
    ]);
  };

  const getInitials = () => {
    const first = formData.first_name?.[0] || '';
    const last = formData.last_name?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <Container>
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" />
        </Box>
      </Container>
    );
  }

  return (
    <Container style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Box
          width="100%"
          alignItems="center"
          backgroundColor="primary"
          paddingBottom="l"
          paddingTop="xl">
          <Box
            marginTop="xl"
            width={100}
            height={100}
            borderRadius="rounded"
            backgroundColor="white"
            justifyContent="center"
            alignItems="center"
            shadowOpacity={0.1}
            shadowRadius={4}
            elevation={5}>
            <Text color="primary" variant="header" fontSize={42}>
              {getInitials()}
            </Text>
          </Box>
          <Box marginTop="m" alignItems="center" gap="s">
            <Text color="white" variant="title" fontSize={24}>
              {formData.first_name} {formData.last_name}
            </Text>
            <Text color="white" variant="body" opacity={0.9}>
              {formData.phone_number}
            </Text>
          </Box>
        </Box>

        {/* Action Bar */}
        <Box
          flexDirection="row"
          justifyContent="flex-end"
          paddingHorizontal="l"
          paddingTop="l"
          alignItems="center">
          <Button
            variant="ghost"
            onPress={() => setIsEditing(!isEditing)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text color="primary" variant="bodyBold">
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Text>
          </Button>
        </Box>

        <Box flex={1} paddingHorizontal="l" gap="l" paddingBottom="xl">
          {/* Personal Information Card */}
          <Box
            backgroundColor="white"
            borderRadius="l"
            padding="l"
            elevation={2}
            shadowOpacity={0.05}>
            <Text variant="title" marginBottom="m">
              Personal Information
            </Text>
            <Box gap="m">
              {isEditing ? (
                <>
                  <Input
                    title="First Name"
                    icon={User}
                    value={formData.first_name}
                    onChangeText={(text) => setFormData({ ...formData, first_name: text })}
                    placeholder="Enter first name"
                  />
                  <Input
                    title="Last Name"
                    icon={User}
                    value={formData.last_name}
                    onChangeText={(text) => setFormData({ ...formData, last_name: text })}
                    placeholder="Enter last name"
                  />
                  <Input
                    title="Email"
                    icon={Mail}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Input
                    title="Address"
                    icon={MapPin}
                    value={formData.address}
                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                    placeholder="Enter address"
                  />

                  <Input
                    title="Birth Date"
                    icon={Calendar}
                    value={formData.birth_date}
                    placeholder="YYYY-MM-DD"
                    onPress={() => setShowDatePicker(true)}
                  />
                  {showDatePicker && (
                    <DateTimePicker
                      value={formData.birth_date ? new Date(formData.birth_date) : new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, selectedDate) => {
                        if (Platform.OS === 'android') {
                          setShowDatePicker(false);
                        }
                        if (selectedDate) {
                          setFormData({
                            ...formData,
                            birth_date: selectedDate.toISOString().split('T')[0],
                          });
                        }
                      }}
                    />
                  )}
                </>
              ) : (
                <>
                  <Box>
                    <InfoRow icon={Mail} label="Email" value={formData.email || 'Not set'} />
                    {!isEmailVerified && formData.email ? (
                      <Button
                        variant="ghost"
                        onPress={handleVerifyEmail}
                        style={{ alignSelf: 'flex-start', paddingLeft: 32, paddingVertical: 4 }}>
                        <Text variant="details" color="warning" fontWeight="bold">
                          Verify Email
                        </Text>
                      </Button>
                    ) : (
                      isEmailVerified &&
                      formData.email && (
                        <Box
                          style={{ alignSelf: 'flex-start', paddingLeft: 32, paddingVertical: 4 }}>
                          <Text variant="details" color="primary" fontWeight="bold">
                            Verified
                          </Text>
                        </Box>
                      )
                    )}
                  </Box>
                  <InfoRow icon={MapPin} label="Address" value={formData.address || 'Not set'} />
                  <InfoRow
                    icon={Calendar}
                    label="Birth Date"
                    value={formData.birth_date || 'Not set'}
                  />
                </>
              )}
            </Box>
          </Box>

          {/* Emergency Contact Card */}
          <Box
            backgroundColor="white"
            borderRadius="l"
            padding="l"
            elevation={2}
            shadowOpacity={0.05}>
            <Text variant="title" marginBottom="m">
              Emergency Contact
            </Text>
            <Box gap="m">
              {isEditing ? (
                <>
                  <Input
                    title="Contact Person"
                    icon={User}
                    value={formData.contact_person}
                    onChangeText={(text) => setFormData({ ...formData, contact_person: text })}
                    placeholder="Contact name"
                  />
                  <Input
                    title="Contact Number"
                    icon={Phone}
                    value={formData.contact_person_number}
                    onChangeText={(text) =>
                      setFormData({ ...formData, contact_person_number: text })
                    }
                    placeholder="639XXXXXXXXX"
                    keyboardType="phone-pad"
                  />
                </>
              ) : (
                <>
                  <InfoRow icon={User} label="Name" value={formData.contact_person || 'Not set'} />
                  <InfoRow
                    icon={Phone}
                    label="Number"
                    value={formData.contact_person_number || 'Not set'}
                  />
                </>
              )}
            </Box>
          </Box>

          {/* Save Button */}
          {isEditing && (
            <Button onPress={handleSave} isLoading={isLoading}>
              <Text color="white" variant="bodyBold">
                Save Changes
              </Text>
            </Button>
          )}

          {/* Logout Button */}
          <Button
            variant="outline"
            onPress={handleLogout}
            style={{ borderColor: '#ef4444', flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <LogOut size={20} color="#ef4444" />
            <Text color="warning" variant="bodyBold">
              Logout
            </Text>
          </Button>
        </Box>
      </ScrollView>
    </Container>
  );
}

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <Box
    flexDirection="row"
    alignItems="center"
    gap="m"
    paddingVertical="s"
    borderBottomWidth={0.5}
    borderColor="grayLighter">
    <Box width={32} alignItems="center">
      <Icon size={20} color="#737373" />
    </Box>
    <Box flex={1}>
      <Text variant="details" color="muted">
        {label}
      </Text>
      <Text variant="body" color="mainForeground">
        {value}
      </Text>
    </Box>
  </Box>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
});
