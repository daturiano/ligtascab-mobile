import { StyleSheet, Text, View } from 'react-native';

export default function ReportScreen() {
  return (
    <View style={styles.container}>
      <Text>Report</Text>
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
