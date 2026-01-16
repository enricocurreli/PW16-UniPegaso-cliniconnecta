import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsDateString, IsEnum } from "class-validator";
import { AppointmentStatus } from "../../enums/db-enum.enum";


export class GetAgendaDto {
  @ApiPropertyOptional({ example: "2026-01-01" })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: "2026-01-31" })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
