import Box from '../Box';
import Text from '../Text';
import { TextInput, Pressable, StyleSheet, FlatList } from 'react-native';
import { ReactNode, useState, useCallback } from 'react';
import { PlacePrediction, getPlaceAutocomplete } from '@/src/utils/directionsService';

type Props = {
  icon: ReactNode;
  placeholder: string;
  value: string;
  onPressUse?: () => void;
  onChangeText?: (text: string) => void;
  onSelectPlace?: (place: PlacePrediction) => void;
  searchEnabled?: boolean;
  userLocation?: { latitude: number; longitude: number } | null;
};

export default function LocationInputRow({
  icon,
  placeholder,
  value,
  onPressUse,
  onChangeText,
  onSelectPlace,
  searchEnabled = false,
  userLocation,
}: Props) {
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleTextChange = useCallback(
    async (text: string) => {
      onChangeText?.(text);

      if (searchEnabled && text.length >= 2) {
        const predictions = await getPlaceAutocomplete(text, userLocation ?? undefined);
        // Only update if we got results - keep previous suggestions on error
        if (predictions.length > 0) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        }
      } else if (text.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [searchEnabled, userLocation, onChangeText]
  );

  const handleSelectSuggestion = (place: PlacePrediction) => {
    onSelectPlace?.(place);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <Box position="relative" zIndex={showSuggestions ? 100 : 1}>
      <Box
        backgroundColor="primary"
        paddingVertical="l"
        borderRadius="m"
        flexDirection="row"
        alignItems="center"
        width="100%"
        gap="s">
        {icon}
        <TextInput
          placeholderTextColor="#ffffff"
          placeholder={placeholder}
          style={styles.input}
          value={value}
          onChangeText={searchEnabled ? handleTextChange : undefined}
          editable={searchEnabled || !onPressUse}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />

        {onPressUse && (
          <Pressable style={styles.useBtn} onPress={onPressUse}>
            <Text color="white" fontWeight={500}>
              Use
            </Text>
          </Pressable>
        )}
      </Box>

      {showSuggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          top={55}
          left={0}
          right={0}
          backgroundColor="white"
          zIndex={100}
          borderRadius="m"
          style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item)}>
                <Text fontSize={14} fontWeight={500} color="mainForeground" numberOfLines={1}>
                  {item.structured_formatting.main_text}
                </Text>
                <Text fontSize={12} color="muted" numberOfLines={1}>
                  {item.structured_formatting.secondary_text}
                </Text>
              </Pressable>
            )}
          />
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 2,
    color: '#ffffff',
    width: '80%',
  },
  useBtn: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 2,
    right: 0,
    zIndex: 50,
  },
  suggestionsContainer: {
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
