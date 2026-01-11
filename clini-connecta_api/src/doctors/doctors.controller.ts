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
import { DoctorsService } from "./doctors.service";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { Serialize } from "../interceptor/serializer.interceptor";
import { DoctorDTO } from "./dto/doctor.dto";
import { RoleStatus } from "../enums/db-enum.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";
@ApiTags("Dottori")
@ApiBearerAuth()
@Controller("doctors")
@Serialize(DoctorDTO)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Lista di tutti i medici",
    description: "Ottiene la lista di tutti i medici",
  })
  @ApiResponse({
    status: 200,
    description: "Lista medici",
    schema: {
      example: [
        {
          id: 1,
          firstName: "Mario",
          lastName: "Rossi",
          bio: "Ortopedico specializzato nella cura della schiena...",
          phone: "+393331234567",
          licenseNumber: "0001234567",
          user: {
            id: 1,
            email: "mario.rossi@example.com",
            role: "DOTTORE",
          },
        },
        {
          id: 2,
          firstName: "Laura",
          lastName: "Bianchi",
          bio: "Pediatra con 15 anni di esperienza...",
          phone: "+393339876543",
          licenseNumber: "0002345678",
          user: {
            id: 2,
            email: "laura.bianchi@example.com",
            role: "DOTTORE",
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: "Nessun medico trovato",
  })
  findAll() {
    return this.doctorsService.findAll();
  }
  //!---------------------------------

  @Roles(RoleStatus.DOTTORE)
  @Get("account")
  @ApiOperation({
    summary: "Ottieni il tuo profilo medico",
    description:
      "Ritorna il profilo completo del medico autenticato. Richiede autenticazione con ruolo DOTTORE",
  })
  @ApiParam({
    name: "id",
    description: "ID del medico",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Profilo medico ottenuto con successo",
    schema: {
      example: {
        id: 1,
        firstName: "Mario",
        lastName: "Rossi",
        bio: "Ortopedico specializzato nella cura della schiena...",
        phone: "+393331234567",
        licenseNumber: "0001234567",
        user: {
          id: 1,
          email: "mario.rossi@example.com",
          role: "MEDICO",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Non autenticato",
  })
  @ApiResponse({
    status: 403,
    description: "Accesso negato - ruolo non autorizzato",
  })
  @ApiResponse({
    status: 404,
    description: "Profilo medico non trovato",
  })
  getMyProfile(@CurrentUser() user: any) {
    return this.doctorsService.findbyId(user.sub);
  }
  //!---------------------------------

  @Public()
  @Get("search")
  @ApiOperation({
    summary: "Cerca medici",
    description: "Cerca medici per nome, cognome, email o specializzazione",
  })
  @ApiQuery({
    name: "firstName",
    required: false,
    description: "Nome del medico",
    example: "Mario",
  })
  @ApiQuery({
    name: "lastName",
    required: false,
    description: "Cognome del medico",
    example: "Rossi",
  })
  @ApiQuery({
    name: "email",
    required: false,
    description: "Email del medico",
    example: "mario.rossi@doctor.it",
  })
  @ApiQuery({
    name: "specialization",
    required: false,
    description: "Specializzazione",
    example: "Cardiologia",
  })
  @ApiResponse({
    status: 200,
    description: "Lista medici trovati",
    schema: {
      example: [
        {
          id: 1,
          firstName: "Mario",
          lastName: "Rossi",
          bio: "Cardiologo esperto...",
          phone: "+393331234567",
          licenseNumber: "0001234567",
          user: {
            id: 1,
            email: "mario.rossi@doctor.it",
            role: "DOTTORE",
          },
          specialization: {
            id: 1,
            name: "Cardiologia",
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: "Nessun medico trovato",
  })
  searchDottors(
    @Query("firstName") firstName?: string,
    @Query("lastName") lastName?: string,
    @Query("email") email?: string,
    @Query("specialization") specialization?: string
  ) {
    return this.doctorsService.findbyQuery(
      firstName,
      lastName,
      email,
      specialization
    );
  }
  //!---------------------------------

  @Roles(RoleStatus.DOTTORE)
  @Patch("account/update")
  @ApiOperation({
    summary: "Aggiorna profilo medico",
    description:
      "Permette al medico autenticato di aggiornare il proprio profilo professionale",
  })
  @ApiResponse({
    status: 200,
    description: "Profilo aggiornato con successo",
    schema: {
      example: {
        id: 1,
        firstName: "Mario",
        lastName: "Rossi",
        bio: "Ortopedico specializzato nella cura della schiena e delle articolazioni...",
        phone: "+393331234567",
        licenseNumber: "0001234567",
        user: {
          id: 1,
          email: "mario.rossi@example.com",
          role: "DOTTORE",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Dati non validi",
  })
  @ApiResponse({
    status: 401,
    description: "Non autenticato",
  })
  @ApiResponse({
    status: 403,
    description: "Accesso negato - ruolo non autorizzato",
  })
  @ApiResponse({
    status: 404,
    description: "Profilo medico non trovato",
  })
  update(@CurrentUser() user: any, @Body() updateDocto: UpdateDoctorDto) {
    return this.doctorsService.updateProfile(user.sub, updateDocto);
  }
  //!---------------------------------
  @Roles(RoleStatus.ADMIN)
  @Delete(":id")
  @ApiOperation({
    summary: "Elimina medico",
    description: "Elimina un medico (solo admin)",
  })
  @ApiParam({
    name: "id",
    description: "ID del medico da eliminare",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: "Medico eliminato con successo",
  })
  @ApiResponse({
    status: 404,
    description: "Medico non trovato",
  })
  @ApiResponse({
    status: 403,
    description: "Accesso negato (solo admin)",
  })
  remove(@Param("id") id: string) {
    return this.doctorsService.remove(parseInt(id));
  }
}
