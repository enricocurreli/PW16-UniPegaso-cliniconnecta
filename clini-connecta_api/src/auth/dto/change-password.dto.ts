import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

@ApiSchema({ name: 'Cambio Password' })
export class ChangePasswordDto {
  @ApiProperty({
    example: "OldPassword123!",
    description: "Password attuale",
    minLength: 6,
    type: String,
  })
  @IsString()
  @MinLength(6)
  currentPassword: string;
  @ApiProperty({
    example: "NewPassword456!",
    description: "Nuova password (minimo 6 caratteri)",
    minLength: 6,
    type: String,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
