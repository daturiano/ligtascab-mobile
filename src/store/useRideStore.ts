import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Ride, Tricycle, Report } from '../types';

interface RideStore {
  tricycleDetails: Tricycle | null;
  rideDetails: Ride | null;
  reportDetails: Report | null;
  setTricycleDetails: (tricycle: Tricycle | null) => void;
  setRideDetails: (ride: Ride | null) => void;
  setReportDetails: (report: Report | null) => void;
  clearAll: () => void;
}

export const useRideStore = create<RideStore>()(
  persist(
    (set) => ({
      tricycleDetails: null,
      rideDetails: null,
      reportDetails: null,

      setTricycleDetails: (tricycle) => set({ tricycleDetails: tricycle }),
      setRideDetails: (ride) => set({ rideDetails: ride }),
      setReportDetails: (report) => set({ reportDetails: report }),

      clearAll: () =>
        set({
          tricycleDetails: null,
          rideDetails: null,
          reportDetails: null,
        }),
    }),
    {
      name: 'ride-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        tricycleDetails: state.tricycleDetails,
        rideDetails: state.rideDetails,
        reportDetails: state.reportDetails,
      }),
    }
  )
);
