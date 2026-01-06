import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Appointment } from "../../appointments/entities/appointment.entity";
import { DoctorClinic } from "../../doctor-clinics/entities/doctor-clinic.entity";

@Entity({ name: 'CLINICS' })
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ name: 'postal_code', type: 'varchar' })
  postalCode: string;

  @Column({ type: 'varchar' })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => DoctorClinic, (dc) => dc.clinic)
  doctorClinics: DoctorClinic[];

  @OneToMany(() => Appointment, (appointment) => appointment.clinic)
  appointments: Appointment[];
}

