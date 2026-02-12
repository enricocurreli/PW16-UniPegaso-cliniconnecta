import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "../../doctors/entities/doctor.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";

@Entity({ name: "DOCTOR_CLINIC" })
export class DoctorClinic {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => Doctor, (doctor) => doctor.doctorClinics, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "doctor_id" })
  doctor!: Doctor;
  @ManyToOne(() => Clinic, (clinic) => clinic.doctorClinics, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "clinic_id" })
  clinic!: Clinic;
}
