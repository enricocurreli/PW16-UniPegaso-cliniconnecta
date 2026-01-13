import { Module } from '@nestjs/common';
import { DoctorClinicsService } from './doctor-clinics.service';
import { DoctorClinicsController } from './doctor-clinics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Clinic } from '../clinics/entities/clinic.entity';
import { DoctorClinic } from './entities/doctor-clinic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Clinic, DoctorClinic])
  ],
  controllers: [DoctorClinicsController],
  providers: [DoctorClinicsService],
})
export class DoctorClinicsModule {}
