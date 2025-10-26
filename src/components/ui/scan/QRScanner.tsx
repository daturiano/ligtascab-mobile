import { fetchTricycleDetails } from '@/src/services/db';
import { Tricycle } from '@/src/types';
import { useQuery } from '@tanstack/react-query';
import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { SwitchCamera } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Box from '../Box';
import Card from '../Card';
import Text from '../Text';
import OnScanModal from './OnScanModal';

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraDisabled, setCameraDisabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState('');

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const { data: tricycle_details } = useQuery<Tricycle | null>({
    queryKey: ['tricycle-details', scanResult],
    queryFn: async () => {
      if (!scanResult) return null;
      const { data, error } = await fetchTricycleDetails(scanResult);
      if (error) {
        setScanError(error.message);
      }
      return data;
    },
    enabled: !!scanResult,
    retry: true,
  });

  useEffect(() => {
    if (tricycle_details) {
      setCameraDisabled(true);
      setVisible(true);
    }
  }, [tricycle_details]);

  if (!permission) {
    return <View />;
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const exitModalHandler = () => {
    setScanError(null);
    setCameraDisabled(false);
    setVisible(false);
    setScanResult('');
  };

  return (
    <Card>
      <Box position="relative" width={'100%'} justifyContent="center" flex={1} overflow="hidden">
        <CameraView
          active={!cameraDisabled}
          style={StyleSheet.absoluteFill}
          facing={facing}
          onBarcodeScanned={(scanningResult: BarcodeScanningResult) => {
            if (!!scanningResult.data) {
              setScanResult(scanningResult.data);
            }
          }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={toggleCameraFacing}>
            <SwitchCamera color={'#ffffff'} size={32} />
          </TouchableOpacity>
        </View>
        <Overlay />
      </Box>
      {tricycle_details && (
        <OnScanModal
          tricycle_details={tricycle_details}
          visible={visible}
          exitModalHandler={exitModalHandler}
        />
      )}
    </Card>
  );
}

const Overlay = () => (
  <View style={styles.overlayContainer}>
    <View style={styles.topOverlay} />
    <View style={styles.middleRow}>
      <View style={styles.sideOverlay} />
      <View style={styles.frame} />
      <View style={styles.sideOverlay} />
    </View>
    <View style={styles.bottomOverlay}>
      <Text
        textAlign="center"
        variant="description"
        fontSize={14}
        color="white"
        paddingHorizontal="xxl">
        Hold the code inside the frame, it will be scanned automatically
      </Text>
    </View>
  </View>
);

const { width, height } = Dimensions.get('window');
const overlayColor = 'rgba(0,0,0,0.6)';
const frameSize = width * 0.7;

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOverlay: {
    width: '100%',
    height: (height - frameSize) / 2,
    backgroundColor: overlayColor,
  },
  middleRow: {
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: overlayColor,
  },
  buttonContainer: {
    position: 'absolute',
    zIndex: 50,
    right: 20,
    bottom: 20,
  },
  frame: {
    width: frameSize,
    height: frameSize,
    borderColor: '#1FAB89',
    borderWidth: 2,
    borderRadius: 10,
  },
  bottomOverlay: {
    width: '100%',
    height: (height - frameSize) / 2,
    backgroundColor: overlayColor,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
});
