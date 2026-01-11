import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

@ApiSchema({ name: "Creazione Clinica" })
export class CreateClinicDto {
  @ApiProperty({
    example: "Clinica le Rose",
    description: "Nome della clinica",
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({
    example: "Via delle cliniche 29",
    description: "Indirizzo della clinica",
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  address: string;
  @ApiProperty({
    example: "Roma",
    description: "Città della clinica",
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  city: string;
  @ApiProperty({
    example: "02092",
    description: "Codice di avviamento postale - CAP",
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  postalCode: string;
  @ApiProperty({
    example: "+393331234567",
    description: "Numero di telefono",
    required: false,
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone?: string;
}
