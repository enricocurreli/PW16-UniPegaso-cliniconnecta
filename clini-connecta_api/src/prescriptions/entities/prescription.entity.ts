import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MedicalReport } from "../../medical-reports/entities/medical-report.entity";

@Entity({ name: "PRESCRIPTIONS" })
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: "medication_name", type: "varchar" })
  medicationName: string;
  @Column({ type: "varchar" })
  dosage: string;
  @Column({ type: "varchar" })
  frequency: string;
  @ManyToOne(()=>MedicalReport, (md)=>md.prescriptions, { onDelete: 'CASCADE' } )
  @JoinColumn({name:'report_id'})
  report: MedicalReport
}
