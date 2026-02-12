import {Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'
import { RoleStatus } from '../../enums/db-enum.enum';
import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'USERS' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({ unique: true, type: "varchar" })
    email!: string;
    @Column({ type: "varchar" })
    @Exclude()
    password!: string;
    @Column({ type: 'enum', enum: RoleStatus, default: RoleStatus.PAZIENTE })
    role!: RoleStatus;
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
    @OneToOne(()=>Patient, (patient)=> patient.user)
    patient?: Patient
    @OneToOne(()=>Doctor, (doctors)=>doctors.user)
    doctors?: Doctor
}
