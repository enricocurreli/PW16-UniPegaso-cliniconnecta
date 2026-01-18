import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { ReportType } from '../../enums/db-enum.enum';
@ApiSchema({ name: 'Creazione report medico' })
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

}
