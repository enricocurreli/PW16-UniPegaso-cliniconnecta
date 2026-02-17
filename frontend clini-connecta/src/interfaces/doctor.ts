import type { DoctorAvailabilityInterface } from "./availability";

export interface UserNested {
  id: number;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
  licenseNumber: string;
  specialization: {
    id: number;
    name: string;
  };
  user: UserNested;
  availabilities: DoctorAvailabilityInterface[];
}

export interface DoctorClinics {
  id: number;
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    bio: string;
    licenseNumber: string;
    createdAt: string;
    specialization: {
      id: number;
      name: string;
    };
    user: UserNested;
  };
}
