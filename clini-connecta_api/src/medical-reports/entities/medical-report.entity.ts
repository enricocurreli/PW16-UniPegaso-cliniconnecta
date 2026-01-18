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
import { ReportType } from "../../enums/db-enum.enum";
import { Prescription } from "../../prescriptions/entities/prescription.entity";
import { Appointment } from "../../appointments/entities/appointment.entity";

@Entity({ name: "MEDICAL_REPORTS" })
export class MedicalReport {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: "report_type", type: "enum", enum: ReportType })
  reportType: ReportType;
  @Column({ type: "varchar" })
  title: string;
  @Column({ type: "text" })
  diagnosis: string;
  @Column({ type: "text", nullable: true })
  treatment: string | null;
  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
  @OneToOne(() => Appointment, (app) => app.medicalReport)
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment: Appointment;
  @Column({ name: "appointment_id" })
  appointmentId: number;
  @OneToMany(() => Prescription, (prescription) => prescription.report, {
    cascade: true,
  })
  prescriptions: Prescription[];
}
 