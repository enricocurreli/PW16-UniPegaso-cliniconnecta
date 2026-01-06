import {Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'
import { RoleStatus } from '../../enums/db-enum.enum';
import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity({ name: 'USERS' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({unique: true, type: "varchar"})
    email:string;
    @Column({type: "varchar"})
    password: string;
    @Column({type:'enum', enum:RoleStatus, default:RoleStatus.PAZIENTE})
    role: RoleStatus
    @CreateDateColumn({ name: 'created_at', type: "varchar" })
    createdAt: Date;
    @UpdateDateColumn({ name: 'updated_at', type: "varchar" })
    updatedAt: Date;
    @OneToOne(()=>Patient, (patient)=> patient.user)
    patient?: Patient
    @OneToOne(()=>Doctor, (doctors)=>doctors.user)
    doctors?: Doctor
}
