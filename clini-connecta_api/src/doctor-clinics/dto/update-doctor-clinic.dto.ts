import { PartialType } from '@nestjs/swagger';
import { CreateDoctorClinicDto } from './create-doctor-clinic.dto';

export class UpdateDoctorClinicDto extends PartialType(CreateDoctorClinicDto) {}
