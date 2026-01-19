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
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserDTO } from "../users/dto/user.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleStatus } from "../enums/db-enum.enum";
import { Serialize } from "../interceptor/serializer.interceptor";
import { PatientDTO } from "../patients/dto/patient.dto";
import { Public } from "../auth/decorators/public.decorator";
import { GetAvailableSlotsDto } from "./dto/get-available-slots.dto";
import { AvailableSlotsResult } from "./types/available-slots.type";
import { Appointment } from "./entities/appointment.entity";
import { User } from "../users/entities/user.entity";
import { GetAgendaDto } from "./dto/get-agenda.dto";
@ApiTags("Appuntamenti")
@Serialize(PatientDTO)
@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Public()
  @Get("available-slots")
  @ApiOperation({
    summary: "Recupera gli slot disponibili per un medico in una clinica",
    description: `
   " Restituisce tutti gli slot disponibili per:
    - un medico specifico
    - una clinica specifica
    - una data specifica

    Tiene conto di:
    - disponibilità del medico
    - periodo di validità
    - appuntamenti già confermati
    - durata standard della visita"
    `,
  })
  @ApiResponse({
    status: 200,
    description: "Lista degli slot disponibili",
  })
  @ApiBadRequestResponse({
    description: "Parametri non validi o data fuori periodo",
  })
  @ApiNotFoundResponse({
    description: "Medico o clinica non trovati",
  })
  async getAvailableSlots(
    @Query() query: GetAvailableSlotsDto,
  ): Promise<AvailableSlotsResult> {
    return this.appointmentsService.getAvailableSlots(query);
  }

  @Post("create")
  @ApiOperation({
    summary: "Crea una nuova prenotazione",
    description: `
    Crea una prenotazione per il paziente autenticato.

    Il sistema:
    - verifica la disponibilità del medico
    - controlla la validità della data
    - evita sovrapposizioni con altri appuntamenti
    - gestisce la concorrenza tramite transazioni e lock

    Non è possibile prenotare slot già occupati.
    `,
  })
  @ApiResponse({
    status: 201,
    description: "Prenotazione creata con successo",
    type: Appointment,
  })
  @ApiBadRequestResponse({
    description: "Dati non validi o data fuori periodo",
  })
  @ApiConflictResponse({
    description: "Lo slot selezionato non è disponibile",
  })
  @ApiNotFoundResponse({
    description: "Paziente o disponibilità non trovata",
  })
  async create(
    @CurrentUser() user: UserDTO,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.create(user, createAppointmentDto);
  }

  @Get("patient-appointments")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Agenda del paziente",
    description:
      "Restituisce tutti gli appuntamenti del paziente loggato, includendo il medical report completo e i file di prescrizione caricati.",
  })
  @ApiResponse({
    status: 200,
    description: "Lista appuntamenti con report e prescrizioni",
  })
  async getMyAppointments(@CurrentUser() user: UserDTO) {
    return this.appointmentsService.getPatientAgenda(user.sub);
  }

  @Get("doctor-appointments")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Agenda del medico" })
  async getDoctorAppointments(
    @CurrentUser() user: UserDTO,
    @Query() query: GetAgendaDto,
  ) {
    return this.appointmentsService.getDoctorAgenda(user.sub, query);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Cancella un appuntamento (solo prima della data/ora)",
  })
  @ApiResponse({
    status: 200,
    description: "Appuntamento cancellato",
    type: Appointment,
  })
  remove(@CurrentUser() user: UserDTO, @Param("id") id: string) {
    return this.appointmentsService.remove(parseInt(id), user.sub);
  }
}
