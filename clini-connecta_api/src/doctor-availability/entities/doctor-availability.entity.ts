import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Doctor } from "../../doctors/entities/doctor.entity";
import { DayOfWeek } from "../../enums/db-enum.enum";
import { Clinic } from "../../clinics/entities/clinic.entity";

@Entity({ name: "DOCTOR_AVAILABILITY" })
export class DoctorAvailability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "doctor_id" })
  doctorId: number;

  @Column({
    type: "enum",
    enum: DayOfWeek,
    name: "day_of_week",
  })
  dayOfWeek: DayOfWeek;

  @Column({ type: "time", name: "start_time" })
  startTime: string;

  @Column({ type: "time", name: "end_time" })
  endTime: string;

  @Column({ default: true, name: "is_active" })
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Doctor, { onDelete: "CASCADE" })
  @JoinColumn({ name: "doctor_id" })
  doctor: Doctor;
  @ManyToOne(() => Clinic, (clinic) => clinic.availabilities, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;
}
