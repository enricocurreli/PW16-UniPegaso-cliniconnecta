import { ApiProperty, ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { ReportType } from "../../enums/db-enum.enum";
import { Expose, Type } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
@ApiSchema({ name: "Modifica report medico" })
export class UpdateMedicalReportDto {
  // @ApiProperty({ example: 1 })
  // id: number;

  @ApiProperty({ enum: ReportType, example: ReportType.PRIMA_VISITA })
  @IsEnum(ReportType)
  @IsOptional()

  reportType: ReportType;

  @ApiProperty({ example: "Visita cardiologica di controllo" })
  @IsString()
  @IsOptional()

  title: string;

  @ApiProperty({ example: "Paziente in buone condizioni generali" })
  @IsString()
  @IsOptional()

  diagnosis: string;

  @ApiPropertyOptional({ example: "Riposo per 7 giorni" })
  @IsString()
  @IsOptional()

  treatment: string | null;


}
