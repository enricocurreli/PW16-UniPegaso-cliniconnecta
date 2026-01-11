import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { AuthGuard } from '../auth/guard/authGuard.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleStatus } from '../enums/db-enum.enum';
@ApiTags("Cliniche")
@ApiBearerAuth()
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}
  @Public()
  @Get()
  findAll() {
    return this.clinicsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicsService.findOneById(parseInt(id));
  }
  
  @Roles(RoleStatus.ADMIN)
  @Post()
  create(@Body() createClinicDto: CreateClinicDto) {
    return this.clinicsService.create(createClinicDto);
  }


  @Roles(RoleStatus.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClinic: UpdateClinicDto) {
    return this.clinicsService.update(parseInt(id), updateClinic);
  }

  @Roles(RoleStatus.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicsService.remove(+id);
  }
}
