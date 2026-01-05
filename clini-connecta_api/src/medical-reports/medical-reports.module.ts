import { Module } from '@nestjs/common';
import { MedicalReportsService } from './medical-reports.service';
import { MedicalReportsController } from './medical-reports.controller';

@Module({
  controllers: [MedicalReportsController],
  providers: [MedicalReportsService],
})
export class MedicalReportsModule {}
