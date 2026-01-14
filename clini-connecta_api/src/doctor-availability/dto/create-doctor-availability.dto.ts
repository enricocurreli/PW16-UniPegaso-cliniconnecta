import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { DayOfWeek } from "../../enums/db-enum.enum";
import { Type } from "class-transformer";
@ApiSchema({ name: "Creazione disponibilità medico" })
export class CreateDoctorAvailabilityDto {
  @ApiProperty({
    example: "Lunedì",
    description: "Giorno della settimana",
    enum: DayOfWeek,
    enumName: "Disponibilà medico",
  })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    example: "09:00",
    description: "Inizio orario lavorativo",
    required: true,
  })
  @IsString()
  startTime: string;
  @ApiProperty({
    example: "13:00",
    description: "Fine orario lavorativo",
    required: true,
  })
  @IsString()
  endTime: string;
  @ApiProperty({
    example: "2026-01-01",
    description: "Inizio periodo di riferimento",
    required: true,
  })
  @IsDateString()
  validFrom: Date;
  @ApiProperty({
    example: "2026-01-01",
    description: "Fine periodo di riferimento",
    required: true,
  })
  @IsDateString()
  validTo: Date;
  @ApiProperty({
    example: "1",
    description: "Luogo dell' appuntamento",
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  clinic_id: number;

}
