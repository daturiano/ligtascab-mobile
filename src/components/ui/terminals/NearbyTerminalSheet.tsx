import { Terminal } from '@/src/types';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import NearbyTerminalCard from './NearbyTerminalCard';

type NearbyTerminalSheetProps = {
  terminals: Terminal[];
  onSelectTerminal: (terminal: Terminal) => void;
};

const NearbyTerminalSheet = ({ terminals, onSelectTerminal }: NearbyTerminalSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['10%', '25%', '40%'], []);
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetView>
        <Box gap="l" paddingHorizontal="xl" paddingVertical="s">
          <Text variant="title">Nearby Tricycles</Text>
          {terminals.map((terminal, index) => (
            <NearbyTerminalCard
              key={index}
              terminal={terminal}
              onPressTerminal={() => onSelectTerminal(terminal)}
            />
          ))}
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default NearbyTerminalSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fffbfc',
  },
  handleIndicator: {
    backgroundColor: '#ccc',
    width: 40,
  },
});
