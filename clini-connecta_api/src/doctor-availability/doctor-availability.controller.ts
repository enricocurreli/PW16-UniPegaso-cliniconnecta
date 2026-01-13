import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorAvailabilityService } from './doctor-availability.service';
import { UpdateDoctorAvailabilityDto } from './dto/update-doctor-availability.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateDoctorAvailabilityDto } from './dto/create-doctor-availability.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleStatus } from '../enums/db-enum.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DoctorDTO } from '../doctors/dto/doctor.dto';
import { Serialize } from '../interceptor/serializer.interceptor';
import { UserDTO } from '../users/dto/user.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags("Calendario medici")
@ApiBearerAuth()
@Serialize(DoctorDTO)
@Controller('doctor-availability')
export class DoctorAvailabilityController {
  constructor(private readonly doctorAvailabilityService: DoctorAvailabilityService) {}

  @Roles(RoleStatus.DOTTORE)
  @Post('create')
  @ApiOperation({ 
    summary: 'Crea una nuova disponibilità', 
    description: 'Permette a un dottore di creare una nuova disponibilità per una clinica specifica' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Disponibilità creata con successo' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dati non validi' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Non autorizzato' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Accesso negato - solo per dottori' 
  })
  create(@CurrentUser() user: UserDTO, @Body() availability: CreateDoctorAvailabilityDto) {
    return this.doctorAvailabilityService.createAvailability(user, availability);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ 
    summary: 'Ottieni tutte le disponibilità di un dottore', 
    description: 'Restituisce tutte le disponibilità di un dottore specifico con le cliniche associate' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del dottore', 
    type: Number 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Disponibilità recuperate con successo' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Dottore non trovato' 
  })
  findAll(@Param('id') id: string) {
    return this.doctorAvailabilityService.findAllByDoc(parseInt(id));
  }

  // @Patch(':id')
  // @ApiOperation({ 
  //   summary: 'Aggiorna una disponibilità', 
  //   description: 'Modifica i dettagli di una disponibilità esistente' 
  // })
  // @ApiParam({ 
  //   name: 'id', 
  //   description: 'ID della disponibilità da aggiornare', 
  //   type: Number 
  // })
  // @ApiResponse({ 
  //   status: 200, 
  //   description: 'Disponibilità aggiornata con successo' 
  // })
  // @ApiResponse({ 
  //   status: 404, 
  //   description: 'Disponibilità non trovata' 
  // })
  // @ApiResponse({ 
  //   status: 401, 
  //   description: 'Non autorizzato' 
  // })
  // update(@Param('id') id: string, @Body() updateDoctorAvailabilityDto: UpdateDoctorAvailabilityDto) {
  //   return this.doctorAvailabilityService.update(+id, updateDoctorAvailabilityDto);
  // }
@Roles(RoleStatus.DOTTORE)
@Delete(':id')
@ApiOperation({ 
  summary: 'Elimina una disponibilità', 
  description: 'Rimuove una propria disponibilità dal calendario. Un dottore può eliminare solo le proprie disponibilità.' 
})
@ApiParam({ 
  name: 'id', 
  description: 'ID della disponibilità da eliminare', 
  type: Number 
})
@ApiResponse({ 
  status: 200, 
  description: 'Disponibilità eliminata con successo' 
})
@ApiResponse({ 
  status: 403, 
  description: 'Non puoi eliminare disponibilità di altri dottori' 
})
@ApiResponse({ 
  status: 404, 
  description: 'Disponibilità non trovata' 
})
remove(@Param('id') id: string, @CurrentUser() user: UserDTO) {
  return this.doctorAvailabilityService.remove(parseInt(id), user);
}
}
