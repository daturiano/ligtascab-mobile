import { StyleSheet, Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [isNewUser, setIsNewUser] = useState(true);

  useEffect(() => {
    const checkNewUser = async () => {
      try {
        const value = await AsyncStorage.getItem('@isNewUser');
        if (value != null) {
          setIsNewUser(false);
        } else {
          await AsyncStorage.setItem('@isNewUser', 'false');
        }
      } catch (error) {
        console.log('Error new user', error);
      }
    };
    checkNewUser();
  }, []);

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@isNewUser');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-red-500">ligtascab.</Text>
    </View>
  );
}
