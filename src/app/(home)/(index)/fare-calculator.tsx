import { StyleSheet, Text, View } from 'react-native';

export default function FareCalculator() {
  return (
    <View style={styles.container}>
      <Text>Fare</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
