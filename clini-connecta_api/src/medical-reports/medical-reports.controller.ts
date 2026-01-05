import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicalReportsService } from './medical-reports.service';
import { CreateMedicalReportDto } from './dto/create-medical-report.dto';
import { UpdateMedicalReportDto } from './dto/update-medical-report.dto';

@Controller('medical-reports')
export class MedicalReportsController {
  constructor(private readonly medicalReportsService: MedicalReportsService) {}

  @Post()
  create(@Body() createMedicalReportDto: CreateMedicalReportDto) {
    return this.medicalReportsService.create(createMedicalReportDto);
  }

  @Get()
  findAll() {
    return this.medicalReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalReportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicalReportDto: UpdateMedicalReportDto) {
    return this.medicalReportsService.update(+id, updateMedicalReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalReportsService.remove(+id);
  }
}
