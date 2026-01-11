import { ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema({ name: 'Creazione specializzazione' })
export class CreateSpecializationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}