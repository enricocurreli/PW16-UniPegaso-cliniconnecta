import { Injectable } from '@nestjs/common';
import { CreateDoctorClinicDto } from './dto/create-doctor-clinic.dto';
import { UpdateDoctorClinicDto } from './dto/update-doctor-clinic.dto';

@Injectable()
export class DoctorClinicsService {
  create(createDoctorClinicDto: CreateDoctorClinicDto) {
    return 'This action adds a new doctorClinic';
  }

  findAll() {
    return `This action returns all doctorClinics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorClinic`;
  }

  update(id: number, updateDoctorClinicDto: UpdateDoctorClinicDto) {
    return `This action updates a #${id} doctorClinic`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorClinic`;
  }
}
