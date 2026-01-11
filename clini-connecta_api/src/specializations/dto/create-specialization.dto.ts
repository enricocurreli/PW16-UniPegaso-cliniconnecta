import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

@ApiSchema({ name: "Creazione specializzazione" })
export class CreateSpecializationDto {
  @ApiProperty({
    example: "Cardiologia",
    description: "Specializzazione del medico",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
