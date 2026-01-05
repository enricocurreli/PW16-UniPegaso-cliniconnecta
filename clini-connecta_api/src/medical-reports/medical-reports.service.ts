import { Injectable } from '@nestjs/common';
import { CreateMedicalReportDto } from './dto/create-medical-report.dto';
import { UpdateMedicalReportDto } from './dto/update-medical-report.dto';

@Injectable()
export class MedicalReportsService {
  create(createMedicalReportDto: CreateMedicalReportDto) {
    return 'This action adds a new medicalReport';
  }

  findAll() {
    return `This action returns all medicalReports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicalReport`;
  }

  update(id: number, updateMedicalReportDto: UpdateMedicalReportDto) {
    return `This action updates a #${id} medicalReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalReport`;
  }
}
