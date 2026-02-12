import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Appointment } from "../../appointments/entities/appointment.entity";
import { Gender } from "../../enums/db-enum.enum";

@Entity({ name: "PATIENTS" })
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ name: "first_name", type: "varchar" })
  firstName!: string;
  @Column({ name: "last_name", type: "varchar" })
  lastName!: string;
  @Column({ name: "date_of_birth", type: "date", nullable: true })
  dateOfBirth!: Date | null;
  @Column({ name: "city_of_birth", nullable: true, type: "varchar" })
  cityOfBirth!: string | null;
  @Column({ name: "province_of_birth", nullable: true, type: "varchar" })
  provinceOfBirth!: string | null;
  @Column({ name: "gender", type: "enum", nullable: true, enum: Gender })
  gender!: Gender;
  @Column({ nullable: true, type: "varchar" })
  phone!: string | null;
  @Column({
    name: "fiscal_code",
    type: "varchar",
    unique: true,
    nullable: true,
  })
  fiscalCode!: string | null;
  @Column({
    name: "address",
    type: "varchar",
    nullable: true,
  })
  address!: string | null;
  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
  @OneToOne(() => User, (user) => user.patient, { eager: true })
  @JoinColumn({ name: "user_id" })
  user!: User;
  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments!: Appointment[];
}
