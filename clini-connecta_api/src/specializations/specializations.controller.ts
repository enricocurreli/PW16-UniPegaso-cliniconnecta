import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SpecializationsService } from './specializations.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleStatus } from '../enums/db-enum.enum';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags("Specializzazioni")
@Controller('specializations')
export class SpecializationsController {
  constructor(private readonly specializationsService: SpecializationsService) {}

  @Roles(RoleStatus.ADMIN)
  @Post()
  @ApiOperation({ 
    summary: 'Crea una nuova specializzazione',
    description: 'Endpoint riservato agli amministratori per creare una nuova specializzazione medica nel sistema. Richiede autenticazione e ruolo ADMIN'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Specializzazione creata con successo'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dati di input non validi'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Non autenticato'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Accesso negato - Richiesto ruolo ADMIN'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Errore interno del server'
  })
  create(@Body() createSpecializationDto: CreateSpecializationDto) {
    return this.specializationsService.create(createSpecializationDto);
  }

  @Public()
  @Get()
  @ApiOperation({ 
    summary: 'Recupera tutte le specializzazioni',
    description: 'Endpoint pubblico che restituisce l\'elenco completo di tutte le specializzazioni mediche disponibili nel sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista delle specializzazioni recuperata con successo'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Errore interno del server'
  })
  findAll() {
    return this.specializationsService.findAll();
  }

  @Roles(RoleStatus.ADMIN)
  @Delete(':id')
  @ApiOperation({ 
    summary: 'Elimina una specializzazione',
    description: 'Endpoint riservato agli amministratori per eliminare una specializzazione dal sistema. Richiede autenticazione e ruolo ADMIN'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'ID univoco della specializzazione da eliminare',
    example: '1'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Specializzazione eliminata con successo'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Non autenticato'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Accesso negato - Richiesto ruolo ADMIN'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Specializzazione non trovata'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Errore interno del server'
  })
  remove(@Param('id') id: string) {
    return this.specializationsService.remove(parseInt(id));
  }
}