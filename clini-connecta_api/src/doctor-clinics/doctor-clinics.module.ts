import { Module } from '@nestjs/common';
import { DoctorClinicsService } from './doctor-clinics.service';
import { DoctorClinicsController } from './doctor-clinics.controller';

@Module({
  controllers: [DoctorClinicsController],
  providers: [DoctorClinicsService],
})
export class DoctorClinicsModule {}
