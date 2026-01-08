import {
  IsString,
  IsNotEmpty,
  IsEnum,
  MinLength,
  IsEmail,
} from "class-validator";
import { RoleStatus } from "../../enums/db-enum.enum";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema({ name: 'Registrazione utente' })
export class RegisterDto {
  @ApiProperty({
    example: "mario.rossi@example.com",
    description: "Email dell'utente",
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    example: "Password123!",
    description: "Password (minimo 6 caratteri)",
    minLength: 6,
    type: String,
  })
  @IsString()
  @MinLength(6)
  password: string;
  @ApiProperty({
    example: "PAZIENTE",
    description: "Le 3 tipologie di utente",
    enum: RoleStatus,
    enumName: "Ruolo dell'utente",
  })
  @IsEnum(RoleStatus)
  role: RoleStatus;
  @ApiProperty({
    example: "Mario",
    description: "Nome",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty({
    example: "Rossi",
    description: "Cognome",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
