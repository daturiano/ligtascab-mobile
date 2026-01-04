import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Container from '@/src/components/ui/Container';
import Input from '@/src/components/ui/Input';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { supabase } from '@/src/utils/supabase';
import { useRouter } from 'expo-router';
import { LogOut, Mail, MapPin, Phone, User, Calendar } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Alert, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

export default function Profile() {
  const { user, signOutUser } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    birth_date: '',
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
      });
    }
  }, [user]);

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
        })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      } else {
        Alert.alert('Success', 'Profile updated successfully.');
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
        <Box
          width="100%"
          height={200}
          flexDirection="row"
          alignItems="center"
          gap="l"
          paddingHorizontal="l"
          backgroundColor="primary">
          <Box marginTop="xl" padding="xl" borderRadius="rounded" backgroundColor="white">
            <Text color="primaryDark" fontSize={36} fontWeight={600}>
              {getInitials()}
            </Text>
          </Box>
          <Box marginTop="xl" flex={1}>
            <Text color="white" fontSize={22} fontWeight={600}>
              {formData.first_name} {formData.last_name}
            </Text>
            <Text color="white" fontSize={14} style={{ opacity: 0.8 }}>
              {formData.phone_number}
            </Text>
          </Box>
        </Box>

        <Box flex={1} width="100%" padding="l" gap="l">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text fontSize={18} fontWeight={600}>
              Personal Information
            </Text>
            {!isEditing ? (
              <Button variant="ghost" onPress={() => setIsEditing(true)}>
                <Text color="primary" fontWeight={500}>
                  Edit
                </Text>
              </Button>
            ) : (
              <Button variant="ghost" onPress={() => setIsEditing(false)}>
                <Text color="muted" fontWeight={500}>
                  Cancel
                </Text>
              </Button>
            )}
          </Box>

          <Box gap="m">
            <Input
              title="First Name"
              icon={User}
              value={formData.first_name}
              onChangeText={(text) => setFormData({ ...formData, first_name: text })}
              editable={isEditing}
              placeholder="Enter first name"
            />

            <Input
              title="Last Name"
              icon={User}
              value={formData.last_name}
              onChangeText={(text) => setFormData({ ...formData, last_name: text })}
              editable={isEditing}
              placeholder="Enter last name"
            />

            <Input
              title="Email"
              icon={Mail}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              editable={isEditing}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              title="Phone Number"
              icon={Phone}
              value={formData.phone_number}
              editable={false}
              placeholder="Phone number"
            />

            <Input
              title="Address"
              icon={MapPin}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              editable={isEditing}
              placeholder="Enter address"
            />

            <Input
              title="Birth Date"
              icon={Calendar}
              value={formData.birth_date}
              onChangeText={(text) => setFormData({ ...formData, birth_date: text })}
              editable={isEditing}
              placeholder="YYYY-MM-DD"
            />
          </Box>

          {isEditing && (
            <Button onPress={handleSave} isLoading={isLoading}>
              <Text color="white" fontWeight={500}>
                Save Changes
              </Text>
            </Button>
          )}

          <Box marginTop="m" borderTopWidth={1} borderColor="mutedLighter" paddingTop="l">
            <Button
              variant="outline"
              onPress={handleLogout}
              style={{ borderColor: '#ef4444', flexDirection: 'row', gap: 8 }}>
              <LogOut size={20} color="#ef4444" />
              <Text color="warning" fontWeight={500}>
                Logout
              </Text>
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Container>
  );
}

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
