import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
  @Column({ name: "scheduled_at", type: "timestamp" })
  scheduledAt: Date;

  @Column({ name: "duration_minutes", type: "int" })
  durationMinutes: number;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.PRENOTATO,
  })
  status: AppointmentStatus;

  @Column({ type: "text", nullable: true })
  reason: string | null;

  @CreateDateColumn({ name: "created_at", type:'timestamp' })
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
  @OneToMany(() => MedicalReport, (report) => report.appointment)
  medicalReports: MedicalReport[];
}
