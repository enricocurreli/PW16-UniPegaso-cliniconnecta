import { Injectable } from '@nestjs/common';
import { UpdateDoctorAvailabilityDto } from './dto/update-doctor-availability.dto';

@Injectable()
export class DoctorAvailabilityService {

  findAll() {
    return `This action returns all doctorAvailability`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorAvailability`;
  }

  update(id: number, updateDoctorAvailabilityDto: UpdateDoctorAvailabilityDto) {
    return `This action updates a #${id} doctorAvailability`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorAvailability`;
  }
}
