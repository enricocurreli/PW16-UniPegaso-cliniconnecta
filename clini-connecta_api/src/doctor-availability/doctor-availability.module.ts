import { Module } from '@nestjs/common';
import { DoctorAvailabilityService } from './doctor-availability.service';
import { DoctorAvailabilityController } from './doctor-availability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorAvailability } from './entities/doctor-availability.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { DoctorClinic } from '../doctor-clinics/entities/doctor-clinic.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DoctorAvailability, Doctor, DoctorClinic])],
  controllers: [DoctorAvailabilityController],
  providers: [DoctorAvailabilityService,TypeOrmModule],
  exports: [DoctorAvailabilityService]
})
export class DoctorAvailabilityModule {}
