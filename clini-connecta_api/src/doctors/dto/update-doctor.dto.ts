import { PartialType } from '@nestjs/swagger';
import { CreateDoctorDto } from './create-doctor.dto';
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsDateString,
  IsPhoneNumber,
  Length,
  IsEnum,
  IsNumber,
} from "class-validator";


@ApiSchema({ name: 'Modifica dati del medico' })
export class UpdateDoctorDto  {
    @ApiProperty({
    example: "Mario",
    description: "Nome del medico",
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: "Rossi",
    description: "Cognome del medico",
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: "Ortopedico specializzato nella cura della schiena...",
    description: "Descrizione medico",
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    example: "+393331234567",
    description: "Numero di telefono",
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    example: "0001234567",
    description: "Iscrizione all'Ordine dei Medici",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(10, 10)
  licenseNumber?: string;


  @ApiProperty({
    example: "Cardiologia",
    description: "Specializzazione del medico",
    required: false,
  })

  @IsOptional()
  @IsString()
 specialization?: string; 


}

