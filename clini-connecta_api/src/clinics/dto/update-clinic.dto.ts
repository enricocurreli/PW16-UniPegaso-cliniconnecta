import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateClinicDto } from './create-clinic.dto';
@ApiSchema({ name: "Modifica clinica" })
export class UpdateClinicDto extends PartialType(CreateClinicDto) {}
