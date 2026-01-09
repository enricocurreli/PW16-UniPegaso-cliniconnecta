import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { PatientsService } from "./patients.service";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleStatus } from "../enums/db-enum.enum";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { Serialize } from "../interceptor/serializer.interceptor";
import { PatientDTO } from "./dto/patient.dto";


@Controller("patients")
@Serialize(PatientDTO)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}
  //! ROUTES PER PAZIENTI
  @Roles(RoleStatus.PAZIENTE)
  @Get("account")
  @ApiOperation({
    summary: "Ottieni il tuo profilo paziente",
    description: "Ritorna il profilo completo del paziente autenticato",
  })
  @ApiResponse({
    status: 200,
    description: "Profilo paziente",
    schema: {
      example: {
        id: 1,
        firstName: "Mario",
        lastName: "Rossi",
        dateOfBirth: "1990-05-15",
        phone: "+393331234567",
        fiscalCode: "RSSMRA90E15H501X",
        address: "Via Roma 123, Milano",
        user: {
          id: 1,
          email: "mario.rossi@example.com",
          role: "patient",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Profilo paziente non trovato",
  })
  getMyProfile(@CurrentUser() user: any) {
    return this.patientsService.getProfilebyUserId(user.sub);
  }
  //!---------------------------------
  @Roles(RoleStatus.PAZIENTE)
  @Patch("account/update")
  @ApiOperation({
    summary: "Aggiorna il tuo profilo paziente",
    description: "Permette al paziente di aggiornare i propri dati",
  })
  @ApiResponse({
    status: 200,
    description: "Profilo aggiornato con successo",
  })
  @ApiResponse({
    status: 404,
    description: "Profilo paziente non trovato",
  })
  updateMyProfile(
    @CurrentUser() user: any,
    @Body() updatePatientDto: UpdatePatientDto
  ) {
    return this.patientsService.updateProfile(user.sub, updatePatientDto);
  }
  //! ROUTES PER DOTTORI E ADMIN
  @Roles(RoleStatus.DOTTORE, RoleStatus.ADMIN)
  @Get(":id")
  @ApiOperation({
    summary: "Dettaglio paziente per ID",
    description:
      "Ottiene i dettagli di un paziente specifico (solo dottori e admin)",
  })
  @ApiParam({
    name: "id",
    description: "ID del paziente",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Dettagli paziente",
  })
  @ApiResponse({
    status: 404,
    description: "Paziente non trovato",
  })
  @ApiResponse({
    status: 403,
    description: "Accesso negato (solo dottori e admin)",
  })
  findOne(@Param("id") id: string) {
    return this.patientsService.findOne(parseInt(id));
  }
  //!---------------------------------

  @ApiOperation({
    summary: "Lista di tutti i pazienti",
    description: "Ottiene la lista di tutti i pazienti (solo dottori e admin)",
  })
  @ApiResponse({
    status: 200,
    description: "Lista pazienti",
  })
  @ApiResponse({
    status: 404,
    description: "Nessun paziente trovato",
  })
  @ApiResponse({
    status: 403,
    description: "Accesso negato (solo dottori e admin)",
  })
  @Roles(RoleStatus.DOTTORE, RoleStatus.ADMIN)
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }
  //!---------------------------------
  //! SOLO ADMIN
  @Roles(RoleStatus.ADMIN)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Elimina paziente",
    description: "Elimina un paziente (solo admin)",
  })
  @ApiParam({
    name: "id",
    description: "ID del paziente da eliminare",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: "Paziente eliminato con successo",
  })
  @ApiResponse({
    status: 404,
    description: "Paziente non trovato",
  })
  @ApiResponse({
    status: 403,
    description: "Accesso negato (solo admin)",
  })
  remove(@Param("id") id: string) {
    return this.patientsService.remove(parseInt(id));
  }
}
