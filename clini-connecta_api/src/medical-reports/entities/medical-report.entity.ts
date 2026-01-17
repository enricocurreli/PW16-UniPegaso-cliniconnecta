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
  @Column({ type: "varchar" })
  diagnosis: string;
  @Column({ type: "varchar", nullable: true })
  treatment: string | null;
  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
  @OneToOne(() => Appointment, (app) => app.medicalReport, { eager: true })
  @JoinColumn({ name: "appointment_id", referencedColumnName: "id" })
  appointment: Appointment;
  @OneToMany(() => Prescription, (prescription) => prescription.report)
  prescriptions: Prescription[];
}
