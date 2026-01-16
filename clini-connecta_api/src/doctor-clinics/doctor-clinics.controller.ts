import { 
  Controller, 
  Get, 
  Delete, 
  Param, 
  ParseIntPipe,
  HttpStatus 
} from '@nestjs/common';
import { DoctorClinicsService } from './doctor-clinics.service';
import { 
  ApiTags, 
  ApiOperation, 
  ApiParam, 
  ApiResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleStatus } from '../enums/db-enum.enum';

@ApiTags("Medici-Cliniche")
@Controller('doctor-clinics')
export class DoctorClinicsController {
  constructor(private readonly doctorClinicsService: DoctorClinicsService) {}

  @Get('clinic/:clinicId/doctors')
  @ApiOperation({ 
    summary: 'Ottieni tutti i medici di una clinica',
    description: 'Restituisce la lista di tutti i medici associati a una specifica clinica tramite la tabella pivot DoctorClinic'
  })
  @ApiParam({ 
    name: 'clinicId', 
    type: Number,
    description: 'ID della clinica',
    example: 1
  })
  @ApiOkResponse({ 
    description: 'Lista dei medici trovati con successo',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          doctor: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 5 },
              firstName: { type: 'string', example: 'Mario' },
              lastName: { type: 'string', example: 'Rossi' },
              specialization: { type: 'string', example: 'Cardiologo' }
            }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Clinica non trovata' 
  })
  async getDoctors(@Param('clinicId', ParseIntPipe) clinicId: number) {
    return this.doctorClinicsService.getDoctorsByClinic(clinicId);
  }

  @Roles(RoleStatus.ADMIN)
  @Delete(':doctorId/:clinicId')
  @ApiOperation({ 
    summary: 'Rimuovi associazione medico-clinica',
    description: 'Elimina l\'associazione tra un medico e una clinica. Questa operazione dovrebbe essere usata solo in casi eccezionali, poiché le associazioni vengono gestite automaticamente tramite le disponibilità. Funzionalità possibile sono per amministrattori'
  })
  @ApiParam({ 
    name: 'doctorId', 
    type: Number,
    description: 'ID del medico',
    example: 5
  })
  @ApiParam({ 
    name: 'clinicId', 
    type: Number,
    description: 'ID della clinica',
    example: 1
  })
  @ApiOkResponse({ 
    description: 'Associazione eliminata con successo',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Associazione eliminata con successo' }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Associazione medico-clinica non trovata' 
  })
  async remove(
    @Param('doctorId', ParseIntPipe) doctorId: number,
    @Param('clinicId', ParseIntPipe) clinicId: number
  ) {
    return this.doctorClinicsService.removeDoctorFromClinic(doctorId, clinicId);
  }
}
