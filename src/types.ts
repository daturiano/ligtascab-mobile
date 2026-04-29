export type Tricycle = {
  id: string;
  operator_id: string;
  tricycle_details: {
    model: string;
    year: string;
    seating_capacity: string;
    body_number: string;
    fuel_type: string;
    mileage: string;
    maintenance_status: string;
  };
  compliance_details: {
    registration_number: string;
    franchise_number: string;
    or_number: string;
    cr_number: string;
  };
  status?: string;
  plate_number: string;
  registration_expiration: Date;
  franchise_expiration: Date;
  last_maintenance_date: Date;
  image?: string;
  assigned_driver: string;
};

export type Operator = {
  id: string;
  first_name: string;
  last_name: string;
  coop_name?: string;
  phone_number: string;
  email?: string;
  image?: string;
  address: Address;
  birth_date: Date;
};

type Address = {
  address: string;
  province: string;
  postal_code: string;
  municipality: string;
};

export type Driver = {
  id: string;
  operator_id: string;
  first_name: string;
  last_name: string;
  emergency_contact_number: string;
  emergency_contact_name: string;
  phone_number?: string;
  license_number: string;
  license_expiration: Date;
  status?: string;
  email?: string;
  image?: string;
  user_id?: string;
  address: string;
  birth_date: Date;
  rating?: number;
  total_reviews?: number;
};

export type Ride = {
  id: string;
  commuter_id: string;
  tricycle_details: Tricycle;
  driver_details: Driver;
  operator_details: Operator;
  fare: string;
  start_time: Date;
  end_time: Date;
  created_at: Date;
};

export type Commuter = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  birth_date: Date | null;
  contact_person: string | null;
  contact_person_number: string | null;
  created_at: Date;
};

export type Report = {
  id: string;
  ride_id: string;
  report_status: string;
  type: string;
  description: string;
  commuter_id: string;
  created_at: Date;
  ticket_number: string;
};

export type Terminal = {
  direction: string;
  map: {
    latitude: number;
    longitude: number;
  };
  landmarks: string[];
};

export type Review = {
  id: string;
  ride_id: string;
  passenger_id: string;
  driver_id: string;
  rating: number;
  comment: string;
  created_at: Date;
};

export type UserRole = 'commuter' | 'driver' | 'operator' | 'authority';

export type Shift = {
  id: string;
  driver_id: string;
  tricycle_id: string;
  start_time: string;
  end_time: string | null;
  status?: string;
  total_fares?: number;
  total_rides?: number;
  created_at: string;
};

export type ShiftWithTricycle = Shift & {
  tricycle?: Tricycle | null;
};

export type DriverEarningsSummary = {
  todayTotal: number;
  weekTotal: number;
  lifetimeTotal: number;
  hasRealData: boolean;
};

