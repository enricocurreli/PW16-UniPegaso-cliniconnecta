import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignDoctorClinicDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  doctorId: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  clinicId: number;
}
