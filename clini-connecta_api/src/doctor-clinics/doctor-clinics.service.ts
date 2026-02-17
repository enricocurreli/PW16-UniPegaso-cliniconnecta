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

  async getClinicsByDoctor(doctorId: number) {
    return await this.doctorClinicRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ["clinic"],
    });
  }
async getDoctorsByClinic(clinicId: number) {
  const results = await this.doctorClinicRepository.find({
    where: { clinic: { id: clinicId } },
    relations: ['doctor', 'doctor.user', 'doctor.specialization'],
  });

  
  return results.map((dc) => ({
    id: dc.id,
    doctor: {
      id: dc.doctor.id,
      firstName: dc.doctor.firstName,
      lastName: dc.doctor.lastName,
      phone: dc.doctor.phone,
      bio: dc.doctor.bio,
      licenseNumber: dc.doctor.licenseNumber,
      createdAt: dc.doctor.createdAt,
      specialization: dc.doctor.specialization
        ? {
            id: dc.doctor.specialization.id,
            name: dc.doctor.specialization.name,
          }
        : null,
      user: {
        id: dc.doctor.user.id,
        email: dc.doctor.user.email,
        role: dc.doctor.user.role,
        createdAt: dc.doctor.user.createdAt,
        updatedAt: dc.doctor.user.updatedAt,
      },
    },
  }));
}
  async removeDoctorFromClinic(doctorId: number, clinicId: number) {
    return await this.doctorClinicRepository.delete({
      doctor: { id: doctorId },
      clinic: { id: clinicId },
    });
  }
}
