import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleStatus } from '../enums/db-enum.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags("Specializzazioni")
@Controller('specializations')
export class SpecializationsController {
  constructor(private readonly specializationsService: SpecializationsService) {}


  @Roles(RoleStatus.ADMIN)
  @Post()
  create(@Body() createSpecializationDto: CreateSpecializationDto) {
    return this.specializationsService.create(createSpecializationDto);
  }
  //!---------------------------------

  @Public()
  @Get()
  findAll() {
    return this.specializationsService.findAll();
  }

  //!---------------------------------
  @Roles(RoleStatus.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specializationsService.remove(parseInt(id));
  }
}
