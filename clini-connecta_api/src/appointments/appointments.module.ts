import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DoctorAvailability } from '../doctor-availability/entities/doctor-availability.entity';
import { Patient } from '../patients/entities/patient.entity';
import { SlotsService } from './slots/slots.service';
import { Doctor } from '../doctors/entities/doctor.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([Appointment, DoctorAvailability,Patient,Doctor]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService,SlotsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
