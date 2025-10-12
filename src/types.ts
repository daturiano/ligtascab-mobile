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
  created_at: Date;
};
