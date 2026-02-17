import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ClinicsService } from "./clinics.service";
import { CreateClinicDto } from "./dto/create-clinic.dto";
import { UpdateClinicDto } from "./dto/update-clinic.dto";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";
import { AuthGuard } from "../auth/guard/authGuard.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleStatus } from "../enums/db-enum.enum";
import { DoctorDTO } from "../doctors/dto/doctor.dto";
import { Serialize } from "../interceptor/serializer.interceptor";

@ApiTags("Cliniche")
@ApiBearerAuth()
@Serialize(DoctorDTO)
@Controller("clinics")
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Recupera tutte le cliniche",
    description:
      "Endpoint pubblico che restituisce l'elenco completo di tutte le cliniche registrate nel sistema",
  })
  @ApiResponse({
    status: 200,
    description: "Lista cliniche trovate",
    schema: {
      example: [
        {
          id: 1,
          name: "Centro le Rose",
          address: "Via delle cliniche 29",
          city: "Roma",
          postalCode: "00165",
          phone: "+39 06 87654321",
          createdAt: "2026-01-11T22:54:54.221Z",
        },
        {
          id: 2,
          name: "Poliambulatorio Colosseo",
          address: "Via dei Fori Imperiali 789",
          city: "Roma",
          postalCode: "00186",
          phone: "+39 06 55512233",
          createdAt: "2026-01-11T22:55:34.497Z",
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: "Errore interno del server",
  })
  findAll() {
    return this.clinicsService.findAll();
  }

  @Roles(RoleStatus.ADMIN)
  @Post("create")
  @ApiOperation({
    summary: "Crea una nuova clinica",
    description:
      "Endpoint riservato agli amministratori per creare una nuova clinica nel sistema. Richiede autenticazione e ruolo ADMIN",
  })
  @ApiResponse({
    status: 201,
    description: "Clinica creata con successo",
  })
  @ApiResponse({
    status: 400,
    description: "Dati di input non validi",
  })
  @ApiResponse({
    status: 401,
    description: "Non autenticato",
  })
  @ApiResponse({
    status: 403,
    description: "Accesso negato - Richiesto ruolo ADMIN",
  })
  @ApiResponse({
    status: 500,
    description: "Errore interno del server",
  })
  create(@Body() createClinicDto: CreateClinicDto) {
    return this.clinicsService.create(createClinicDto);
  }
  @Public()
  @Get("search-clinics")
   @ApiOperation({ 
    summary: 'Ricerca globale cliniche',
    description: 'Cerca cliniche per nome, città o indirizzo. Ricerca case-insensitive su tutti i campi.'
  })
  @ApiQuery({ 
    name: 'search', 
    required: true, 
    description: 'Termine di ricerca (minimo 3 caratteri)',
    example: 'Milano'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista delle cliniche trovate',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Clinica San Carlo' },
          address: { type: 'string', example: 'Via Roma, 123' },
          city: { type: 'string', example: 'Milano' },
          postalCode: { type: 'string', example: '20100' },
          phone: { type: 'string', example: '+39 02 1234567' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Non autorizzato' })
  @ApiResponse({
    status: 404,
    description: "Nessuna clinica trovata",
  })
  searchClinic(@Query("search") search: string) {
    return this.clinicsService.searchGlobal(search);
  }
  @Public()
  @Get(":id")
  @ApiOperation({
    summary: "Recupera una clinica specifica",
    description:
      "Endpoint pubblico che restituisce i dettagli di una singola clinica tramite il suo ID",
  })
  @ApiParam({
    name: "id",
    type: "string",
    description: "ID univoco della clinica",
    example: "1",
  })
  @ApiResponse({
    status: 200,
    description: "Cliniche trovata con successo",
    schema: {
      example: [
        {
          id: 1,
          name: "Centro le Rose",
          address: "Via delle cliniche 29",
          city: "Roma",
          postalCode: "00165",
          phone: "+39 06 87654321",
          createdAt: "2026-01-11T22:54:54.221Z",
        },
        {
          id: 2,
          name: "Poliambulatorio Colosseo",
          address: "Via dei Fori Imperiali 789",
          city: "Roma",
          postalCode: "00186",
          phone: "+39 06 55512233",
          createdAt: "2026-01-11T22:55:34.497Z",
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: "Clinica non trovata",
  })
  @ApiResponse({
    status: 500,
    description: "Errore interno del server",
  })
  findOne(@Param("id") id: string) {
    return this.clinicsService.findOneById(parseInt(id));
  }
  @Roles(RoleStatus.ADMIN)
  @Patch(":id")
  @ApiOperation({
    summary: "Aggiorna una clinica esistente",
    description:
      "Endpoint riservato agli amministratori per modificare i dati di una clinica esistente. Richiede autenticazione e ruolo ADMIN",
  })
  @ApiParam({
    name: "id",
    type: "string",
    description: "ID univoco della clinica da aggiornare",
    example: "1",
  })
  @ApiResponse({
    status: 200,
    description: "Clinica aggiornata con successo",
  })
  @ApiResponse({
    status: 400,
    description: "Dati di input non validi",
  })
  @ApiResponse({
    status: 401,
    description: "Non autenticato",
  })
  @ApiResponse({
    status: 403,
    description: "Accesso negato - Richiesto ruolo ADMIN",
  })
  @ApiResponse({
    status: 404,
    description: "Clinica non trovata",
  })
  @ApiResponse({
    status: 500,
    description: "Errore interno del server",
  })
  update(@Param("id") id: string, @Body() updateClinic: UpdateClinicDto) {
    return this.clinicsService.update(parseInt(id), updateClinic);
  }

  @Roles(RoleStatus.ADMIN)
  @Delete(":id")
  @ApiOperation({
    summary: "Elimina una clinica",
    description:
      "Endpoint riservato agli amministratori per eliminare una clinica dal sistema. Richiede autenticazione e ruolo ADMIN",
  })
  @ApiParam({
    name: "id",
    type: "string",
    description: "ID univoco della clinica da eliminare",
    example: "1",
  })
  @ApiResponse({
    status: 200,
    description: "Clinica eliminata con successo",
  })
  @ApiResponse({
    status: 401,
    description: "Non autenticato",
  })
  @ApiResponse({
    status: 403,
    description: "Accesso negato - Richiesto ruolo ADMIN",
  })
  @ApiResponse({
    status: 404,
    description: "Clinica non trovata",
  })
  @ApiResponse({
    status: 500,
    description: "Errore interno del server",
  })
  remove(@Param("id") id: string) {
    return this.clinicsService.remove(parseInt(id));
  }
}
