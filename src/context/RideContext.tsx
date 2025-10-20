import { createContext, useContext, useState } from 'react';
import { Report, Ride, Tricycle } from '../types';

type RideContextType = {
  tricycleDetails: Tricycle | null;
  setTricycleDetails: (args: Tricycle | null) => void;
  rideDetails: Ride | null;
  setRideDetails: (args: Ride | null) => void;
  reportDetails: Report | null;
  setReportDetails: (args: Report | null) => void;
};

export const RideContext = createContext<RideContextType | undefined>(undefined);

export function RideProvider({ children }: { children: React.ReactNode }) {
  const [tricycleDetails, setTricycleDetails] = useState<Tricycle | null>(null);
  const [rideDetails, setRideDetails] = useState<Ride | null>(null);
  const [reportDetails, setReportDetails] = useState<Report | null>(null);

  return (
    <RideContext.Provider
      value={{
        tricycleDetails,
        setTricycleDetails,
        rideDetails,
        setRideDetails,
        reportDetails,
        setReportDetails,
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
