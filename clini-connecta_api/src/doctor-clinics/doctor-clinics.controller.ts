import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorClinicsService } from './doctor-clinics.service';
import { AssignDoctorClinicDto } from './dto/assign-doctor-clinic.dto';

@Controller('doctor-clinics')
export class DoctorClinicsController {
  doctorClinicService: any;
  constructor(private readonly doctorClinicsService: DoctorClinicsService) {}

    @Post()
  async assign(@Body() dto: AssignDoctorClinicDto) {
    return this.doctorClinicService.assignDoctorToClinic(
      dto.doctorId, 
      dto.clinicId
    );
  }

  @Get('clinic/:clinicId/doctors')
  async getDoctors(@Param('clinicId') clinicId: number) {
    return this.doctorClinicService.getDoctorsByClinic(clinicId);
  }

  @Delete(':doctorId/:clinicId')
  async remove(
    @Param('doctorId') doctorId: number,
    @Param('clinicId') clinicId: number
  ) {
    return this.doctorClinicService.removeDoctorFromClinic(doctorId, clinicId);
  }
}
