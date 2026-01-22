import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Appointment } from "../../appointments/entities/appointment.entity";
import { DoctorClinic } from "../../doctor-clinics/entities/doctor-clinic.entity";
import { Specialization } from "../../specializations/entities/specialization.entity";
import { User } from "../../users/entities/user.entity";
import { DoctorAvailability } from "../../doctor-availability/entities/doctor-availability.entity";

@Entity({ name: "DOCTORS" })
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name", type: "varchar" })
  firstName: string;

  @Column({ name: "last_name", type: "varchar" })
  lastName: string;
  @Column({ nullable: true, type: "varchar" })
  phone: string | null;

  @OneToOne(() => User, (user) => user.doctors, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "text", nullable: true })
  bio: string | null;

  @Column({type:"varchar", nullable: true })
  licenseNumber: string;
  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;
  
  @ManyToOne(() => Specialization, (specialization) => specialization.doctors, {
    eager: false,
  })
  @JoinColumn({ name: "specialization_id" })
  specialization: Specialization;

  @OneToMany(() => DoctorClinic, (dc) => dc.doctor)
  doctorClinics: DoctorClinic[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => DoctorAvailability, (availability) => availability.doctor)
  availabilities: DoctorAvailability[];
}
