import { Module } from '@nestjs/common';
import { DoctorAvailabilityService } from './doctor-availability.service';
import { DoctorAvailabilityController } from './doctor-availability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorAvailability } from './entities/doctor-availability.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DoctorAvailability])],
  controllers: [DoctorAvailabilityController],
  providers: [DoctorAvailabilityService],
})
export class DoctorAvailabilityModule {}
