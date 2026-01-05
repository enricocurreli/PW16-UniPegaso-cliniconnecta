import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorClinicsService } from './doctor-clinics.service';
import { CreateDoctorClinicDto } from './dto/create-doctor-clinic.dto';
import { UpdateDoctorClinicDto } from './dto/update-doctor-clinic.dto';

@Controller('doctor-clinics')
export class DoctorClinicsController {
  constructor(private readonly doctorClinicsService: DoctorClinicsService) {}

  @Post()
  create(@Body() createDoctorClinicDto: CreateDoctorClinicDto) {
    return this.doctorClinicsService.create(createDoctorClinicDto);
  }

  @Get()
  findAll() {
    return this.doctorClinicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorClinicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorClinicDto: UpdateDoctorClinicDto) {
    return this.doctorClinicsService.update(+id, updateDoctorClinicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorClinicsService.remove(+id);
  }
}
