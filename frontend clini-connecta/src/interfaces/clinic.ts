export interface Clinic {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface DoctorClinic {
  id: number;
  clinic: Clinic;
}