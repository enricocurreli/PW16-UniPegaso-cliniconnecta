import type { Patient } from "./patient";

export interface Appointment {
  id: number;
  appointmentDate: string;        
  appointmentTime: string;        
  durationMinutes: number;
  status: "COMPLETATO" | "CONFERMATO" | "CANCELLATO" | string;
  reason: string;
  notes: string | null;
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    bio: string;
    licenseNumber: string;
    createdAt: string;            
  };
  clinic: {
    id: number;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    createdAt: string;            
  };
  medicalReport: {
    id: number;
    reportType: string;
    title: string;
    diagnosis: string;
    treatment: string | null;
    createdAt: string;            
    appointmentId: number;
  } | null;   
  patient: Patient                    
}
