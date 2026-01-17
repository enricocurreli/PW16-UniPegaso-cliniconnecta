import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Ottieni Slot medici' })
export class GetAvailableSlotsDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  doctorId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  clinicId: number;

  @ApiProperty({ 
    example: '2026-01-20',
    description: 'Data per cui cercare gli slot (YYYY-MM-DD)'
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
