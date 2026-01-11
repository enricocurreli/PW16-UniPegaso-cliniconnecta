import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { SpecializationsModule } from '../specializations/specializations.module';
import { Specialization } from '../specializations/entities/specialization.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Doctor, Specialization])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports:[DoctorsService]
})
export class DoctorsModule {}
