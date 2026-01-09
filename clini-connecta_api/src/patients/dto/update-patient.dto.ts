import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsDateString,
  IsPhoneNumber,
  Length,
  IsEnum,
} from "class-validator";
import { Gender } from "../../enums/db-enum.enum";

@ApiSchema({ name: 'Modifica dati del paziente' })
export class UpdatePatientDto {
  @ApiProperty({
    example: "Mario",
    description: "Nome del paziente",
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: "Rossi",
    description: "Cognome del paziente",
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: "1990-05-15",
    description: "Data di nascita (formato: YYYY-MM-DD)",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
  @ApiProperty({
    example: "Roma",
    description: "Città di nascita",
    required: false,
  })
  @IsOptional()
  @IsString()
  cityOfBirth?: string;
    @ApiProperty({
    example: "RM",
    description: "Provincia di nascita",
    required: false,
  })
  @IsOptional()
  @IsString()
  provinceOfBirth?: string;
  @ApiProperty({
    example: "+393331234567",
    description: "Numero di telefono",
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    example: "RSSMRA90E15H501X",
    description: "Codice fiscale",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(16, 16)
  fiscalCode?: string;

  @ApiProperty({
    example: "Via Roma 123, Milano",
    description: "Indirizzo",
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: "M | F",
    description: "Mascio | Femmina",
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
