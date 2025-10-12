import { createContext, useContext, useState } from 'react';
import { Ride, Tricycle } from '../types';

type RideContextType = {
  tricycleDetails: Tricycle | null;
  setTricycleDetails: (args: Tricycle) => void;
  rideDetails: Ride | null;
  setRideDetails: (args: Ride) => void;
};

export const RideContext = createContext<RideContextType | undefined>(undefined);

export function RideProvider({ children }: { children: React.ReactNode }) {
  const [tricycleDetails, setTricycleDetails] = useState<Tricycle | null>(null);
  const [rideDetails, setRideDetails] = useState<Ride | null>(null);

  return (
    <RideContext.Provider
      value={{
        tricycleDetails,
        setTricycleDetails,
        rideDetails,
        setRideDetails,
      }}>
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const context = useContext(RideContext);

  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }

  return context;
}
