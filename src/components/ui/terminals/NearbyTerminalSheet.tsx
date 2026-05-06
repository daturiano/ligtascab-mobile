
import { Terminal } from '@/src/types';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useMemo, forwardRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import Button from '../Button';
import NearbyTerminalCard from './NearbyTerminalCard';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/src/theme/theme';
import { ArrowLeft, MapPin } from 'lucide-react-native';

type NearbyTerminalSheetProps = {
  terminals: Terminal[];
  selectedTerminal: Terminal | null;
  onSelectTerminal: (terminal: Terminal) => void;
  onBack: () => void;
  onGetDirections: () => void;
};

const NearbyTerminalSheet = forwardRef<BottomSheet, NearbyTerminalSheetProps>(
  ({ terminals, selectedTerminal, onSelectTerminal, onBack, onGetDirections }, ref) => {
    const theme = useTheme<Theme>();
    const snapPoints = useMemo(() => ['15%', '45%'], []);

    return (
      <BottomSheet
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: theme.colors.mainBackground,
          borderTopLeftRadius: theme.borderRadii.xl,
          borderTopRightRadius: theme.borderRadii.xl,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.mutedLight,
          width: 40,
        }}>
        <BottomSheetView>
          <Box paddingHorizontal="l" paddingVertical="m" height="100%">
            {selectedTerminal ? (
              // DETAIL VIEW
              <Box gap="m">
                <Box flexDirection="row" alignItems="center" marginBottom="s">
                    <TouchableOpacity onPress={onBack} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                        <Box padding="s" marginRight="s">
                            <ArrowLeft color={theme.colors.mainForeground} size={24} />
                        </Box>
                    </TouchableOpacity>
                    <Text variant="subheader" numberOfLines={1} flex={1}>
                        {selectedTerminal.direction}
                    </Text>
                </Box>
                
                <Box marginBottom="m">
                    <Text variant="bodyBold" color="primary" marginBottom="s">Landmarks / Routes:</Text>
                    {selectedTerminal.landmarks.map((landmark, idx) => (
                        <Box key={idx} flexDirection="row" alignItems="center" marginBottom="xs">
                            <Box marginRight="s">
                                <MapPin size={16} color={theme.colors.muted} />
                            </Box>
                            <Text variant="body" color="mainForeground">{landmark}</Text>
                        </Box>
                    ))}
                </Box>

                <Button onPress={onGetDirections} paddingVertical="m">
                    <Text variant="bodyBold" color="white" textAlign="center">
                        Get Directions
                    </Text>
                </Button>
              </Box>
            ) : (
              // LIST VIEW
              <Box gap="l">
                <Text variant="subheader" marginLeft="s">
                  Nearby Tricycles
                </Text>
                {terminals.map((terminal, index) => (
                  <NearbyTerminalCard
                    key={index}
                    terminal={terminal}
                    onPressTerminal={() => onSelectTerminal(terminal)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default NearbyTerminalSheet;
