import type { Clinic } from "./clinic";
import type { Doctor } from "./doctor";

export type DayOfWeek =
  | "LUNEDI"
  | "MARTEDI"
  | "MERCOLEDI"
  | "GIOVEDI"
  | "VENERDI"
  | "SABATO"
  | "DOMENICA";

export interface DoctorAvailabilityInterface {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  validFrom: string;
  validTo: string; 
  isActive: boolean;
  createdAt: string; 
  updatedAt: string; 
  doctor: Doctor;
  clinic: Clinic
}


export interface CreateDoctorAvailabilityDto {
  dayOfWeek: DayOfWeek;
  startTime?: string | null;
  endTime?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  isActive?: boolean;
  doctorId: number;
  clinicId: number;
}


export interface UpdateDoctorAvailabilityDto {
  dayOfWeek?: DayOfWeek;
  startTime?: string | null;
  endTime?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  isActive?: boolean;
  doctorId?: number;
  clinicId?: number;
}
