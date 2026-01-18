import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AppointmentStatus } from "../../enums/db-enum.enum";
import { MedicalReport } from "../../medical-reports/entities/medical-report.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";
import { Doctor } from "../../doctors/entities/doctor.entity";
import { Patient } from "../../patients/entities/patient.entity";

@Entity({ name: "APPOINTMENTS" })
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "date", name: "appointment_date" })
  appointmentDate: Date;

  @Column({ type: "time", name: "appointment_time" })
  appointmentTime: string;

  @Column({ name: "duration_minutes", type: "int" })
  durationMinutes: 50;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.CONFERMATO,
  })
  status: AppointmentStatus;

  @Column({ type: "text", nullable: true })
  reason: string | null;
  
  @Column({ type: "text", nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { eager: true })
  @JoinColumn({ name: "doctor_id" })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments, { eager: true })
  @JoinColumn({ name: "patient_id" })
  patient: Patient;

  @ManyToOne(() => Clinic, (clinic) => clinic.appointments, { eager: true })
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;
  
  @OneToOne(() => MedicalReport, (report) => report.appointment)
  medicalReport: MedicalReport;
  
}
