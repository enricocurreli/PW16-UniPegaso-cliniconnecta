import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorAvailabilityService } from './doctor-availability.service';
import { UpdateDoctorAvailabilityDto } from './dto/update-doctor-availability.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Calendario medici")
@Controller('doctor-availability')
export class DoctorAvailabilityController {
  constructor(private readonly doctorAvailabilityService: DoctorAvailabilityService) {}

  @Get()
  findAll() {
    return this.doctorAvailabilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorAvailabilityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorAvailabilityDto: UpdateDoctorAvailabilityDto) {
    return this.doctorAvailabilityService.update(+id, updateDoctorAvailabilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorAvailabilityService.remove(+id);
  }
}
