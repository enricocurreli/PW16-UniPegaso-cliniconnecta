import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MedicalReport } from "../../medical-reports/entities/medical-report.entity";

@Entity({ name: "PRESCRIPTIONS" })
export class Prescription {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column({ name: "medication_name", type: "varchar" })
  medicationName!: string;
  
  @Column({ type: "varchar" })
  dosage!: string;
  
  @Column({ type: "varchar" })
  frequency!: string;
  
  @Column({ type: "varchar", name: "file_path" })
  filePath!: string; 
  
  @Column({ type: "date", name: "start_date" })
  startDate!: Date;
  
  @Column({ type: "date", name: "end_date", nullable: true })
  endDate!: Date | null;
  
  @ManyToOne(() => MedicalReport, (md) => md.prescriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report!: MedicalReport;
}