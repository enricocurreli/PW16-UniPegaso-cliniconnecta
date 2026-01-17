// create-medical-report.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportType } from '../../enums/db-enum.enum';

export class CreateMedicalReportDto {
  @ApiProperty({
    enum: ReportType,
    description: 'Tipo di referto medico',
    example: ReportType.PRIMA_VISITA
  })
  @IsEnum(ReportType)
  @IsNotEmpty()
  reportType: ReportType;

  @ApiProperty({
    description: 'Titolo del referto',
    example: 'Visita cardiologica di controllo'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Diagnosi del referto',
    example: 'Paziente in buone condizioni generali'
  })
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @ApiPropertyOptional({
    description: 'Trattamento prescritto',
    example: 'Riposo per 7 giorni e terapia farmacologica'
  })
  @IsString()
  @IsOptional()
  treatment?: string;

  @ApiPropertyOptional({
    description: 'Percorso del file allegato',
    example: '/uploads/reports/report_123.pdf'
  })
  @IsString()
  @IsOptional()
  filePath?: string;

  @ApiProperty({
    description: 'ID dell\'appuntamento associato',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  appointmentId: number;
}
