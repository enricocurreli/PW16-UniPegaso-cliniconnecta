import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Clinic } from '../clinics/entities/clinic.entity';
import { DoctorAvailability } from '../doctor-availability/entities/doctor-availability.entity';
import { DoctorClinic } from '../doctor-clinics/entities/doctor-clinic.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { MedicalReport } from '../medical-reports/entities/medical-report.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { Specialization } from '../specializations/entities/specialization.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Patient,
      Doctor,
      Clinic,
      Specialization,
      DoctorClinic,
      DoctorAvailability,
      Appointment,
      MedicalReport,
      Prescription,
    ]),
  ],
  providers: [SeedService],
  exports:[SeedService]
})
export class SeedModule {}
