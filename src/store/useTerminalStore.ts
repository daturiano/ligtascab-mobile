import { create } from 'zustand';
import { PlacePrediction } from '@/src/utils/directionsService';

type LocationData = {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
};

type TerminalStore = {
  origin: LocationData | null;
  destination: LocationData | null;

  // Actions
  setOrigin: (location: LocationData | null) => void;
  setDestination: (location: LocationData | null) => void;

  // For Map Selection Mode
  isSelectingOnMap: 'origin' | 'destination' | null;
  setIsSelectingOnMap: (mode: 'origin' | 'destination' | null) => void;
};

export const useTerminalStore = create<TerminalStore>((set) => ({
  origin: null,
  destination: null,
  isSelectingOnMap: null,

  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setIsSelectingOnMap: (mode) => set({ isSelectingOnMap: mode }),
}));
