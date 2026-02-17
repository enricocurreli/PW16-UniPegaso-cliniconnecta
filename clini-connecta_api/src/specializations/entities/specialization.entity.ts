import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Doctor } from "../../doctors/entities/doctor.entity";

@Entity({ name: "SPECIALIZATIONS" })
export class Specialization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  name!: string;

  @OneToMany(() => Doctor, (doctor) => doctor.specialization, {
    eager: false,
  })
  doctors!: Doctor[];
}
