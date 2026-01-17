import { Module } from '@nestjs/common';
import { MedicalReportsService } from './medical-reports.service';
import { MedicalReportsController } from './medical-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalReport } from './entities/medical-report.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([MedicalReport, Appointment])],
  controllers: [MedicalReportsController],
  providers: [MedicalReportsService],
  exports:[MedicalReportsService]
})
export class MedicalReportsModule {}
