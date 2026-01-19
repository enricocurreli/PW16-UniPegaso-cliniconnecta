import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { MedicalReport } from "../../medical-reports/entities/medical-report.entity";

@Exclude()
export class PrescriptionResponseDto {
  @ApiProperty({ example: 10 })
  @Expose()
  id: number;

  @ApiProperty({ example: "Amoxicillina" })
  @Expose()
  medicationName: string;

  @ApiProperty({ example: "500mg" })
  @Expose()
  dosage: string;

  @ApiProperty({ example: "3 volte al giorno" })
  @Expose()
  frequency: string;

  @ApiProperty({ example: "uploads/1768833468958-594466152.pdf" })
  @Expose()
  filePath: string;

  @ApiProperty({ example: "2026-02-19", format: "date" })
  @Expose()
  startDate: string;

  @ApiProperty({ example: "2026-02-26", format: "date" })
  @Expose()
  endDate: string;

  @ApiProperty({ example: 10 })
  @Expose()
  reportId: number;
  
  @Exclude()
  report: MedicalReport;
}
