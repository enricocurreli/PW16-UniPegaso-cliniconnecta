import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
@ApiSchema({ name: "Modifica appuntamento" })
export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
