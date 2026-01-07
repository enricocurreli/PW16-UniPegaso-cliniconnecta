import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'mario.rossi@example.com',
    description: 'Email dell\'utente',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password dell\'utente',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
