import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DoctorClinic } from "./entities/doctor-clinic.entity";

@Injectable()
export class DoctorClinicsService {
  constructor(
    @InjectRepository(DoctorClinic)
    private doctorClinicRepository: Repository<DoctorClinic>
  ) {}

  async assignDoctorToClinic(doctorId: number, clinicId: number) {
    const doctorClinic = this.doctorClinicRepository.create({
      doctor: { id: doctorId },
      clinic: { id: clinicId },
    });
    return await this.doctorClinicRepository.save(doctorClinic);
  }
  async getClinicsByDoctor(doctorId: number) {
    return await this.doctorClinicRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ["clinic"],
    });
  }
  async getDoctorsByClinic(clinicId: number) {
    return await this.doctorClinicRepository.find({
      where: { clinic: { id: clinicId } },
      relations: ["doctor"],
    });
  }
  async removeDoctorFromClinic(doctorId: number, clinicId: number) {
    return await this.doctorClinicRepository.delete({
      doctor: { id: doctorId },
      clinic: { id: clinicId },
    });
  }
}
