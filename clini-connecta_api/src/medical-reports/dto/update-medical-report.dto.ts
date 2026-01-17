import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportType } from '../../enums/db-enum.enum';
import { Expose, Type } from 'class-transformer';

export class UpdateMedicalReportDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ enum: ReportType, example: ReportType.PRIMA_VISITA })
  @Expose()
  reportType: ReportType;

  @ApiProperty({ example: 'Visita cardiologica di controllo' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'Paziente in buone condizioni generali' })
  @Expose()
  diagnosis: string;

  @ApiPropertyOptional({ example: 'Riposo per 7 giorni' })
  @Expose()
  treatment: string | null;

  @ApiPropertyOptional({ example: '/uploads/reports/report_123.pdf' })
  @Expose()
  filePath: string | null;

  @ApiProperty({ example: '2026-01-17T15:23:00.000Z' })
  @Expose()
  createdAt: Date;


}
