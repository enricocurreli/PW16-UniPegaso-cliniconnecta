import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { AppointmentStatus } from "../../enums/db-enum.enum";
@ApiSchema({ name: "Creazione appuntamento" })
export class CreateAppointmentDto {
  @ApiProperty({
    description: "Data dell'appuntamento",
    example: "2026-01-20",
    type: String,
    format: "date",
  })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiProperty({
    description: "Orario dell'appuntamento (formato HH:MM)",
    example: "14:30",
    pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "appointmentTime deve essere nel formato HH:MM (es. 14:30)",
  })
  appointmentTime: string;

  @ApiPropertyOptional({
    description: "Stato dell'appuntamento",
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFERMATO,
    default: AppointmentStatus.CONFERMATO,
  })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @ApiPropertyOptional({
    description: "Motivo della visita",
    example: "Controllo periodico",
    maxLength: 500,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({
    description: "Note aggiuntive sull'appuntamento",
    example: "Il paziente ha portato le analisi del sangue",
    maxLength: 1000,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;

  @ApiProperty({
    description: "ID del medico",
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  doctorId: number;

  // @ApiProperty({
  //   description: "ID del paziente",
  //   example: 5,
  //   type: Number,
  // })
  // @IsInt()
  // @IsNotEmpty()
  // @Type(() => Number)
  // patientId: number;

  @ApiProperty({
    description: "ID della clinica",
    example: 2,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  clinicId: number;
}
