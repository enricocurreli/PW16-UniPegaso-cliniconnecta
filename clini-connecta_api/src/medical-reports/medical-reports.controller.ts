import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MedicalReportsService } from "./medical-reports.service";
import { CreateMedicalReportDto } from "./dto/create-medical-report.dto";
import { UpdateMedicalReportDto } from "./dto/update-medical-report.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserDTO } from "../users/dto/user.dto";
import { MedicalReport } from "./entities/medical-report.entity";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleStatus } from "../enums/db-enum.enum";
@ApiTags("Report medici")
@ApiBearerAuth()
@Controller("medical-reports")
export class MedicalReportsController {
  constructor(private readonly medicalReportsService: MedicalReportsService) {}

  @Roles(RoleStatus.DOTTORE)
  @Get('reports')
  @ApiOperation({ 
    summary: 'Recupera tutti i referti medici del medico loggato',
    description: 'Restituisce l\'elenco completo di tutti i referti medici creati dal medico autenticato, includendo diagnosi, trattamento e informazioni degli appuntamenti associati'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista dei referti medici recuperata con successo',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autenticato - Token JWT mancante o non valido',
  })
  @ApiResponse({
    status: 403,
    description: 'Accesso negato - Solo i medici possono accedere ai propri referti',
  })
  getMedicalReport(
    @CurrentUser() user: UserDTO,
  ) {

    return this.medicalReportsService.getMedicalReports(user.sub)
  }

  @Roles(RoleStatus.DOTTORE)
  @Post("create/:appointmentId")
  @ApiOperation({
    summary: "Crea il medical report di un appuntamento",
    description:
      "Il medico crea il referto di una visita. Alla creazione il relativo appuntamento viene automaticamente marcato come COMPLETATO.",
  })
  @ApiParam({
    name: "appointmentId",
    type: Number,
    description: "ID dell'appuntamento",
    example: 12,
  })
  @ApiResponse({
    status: 201,
    description: "Medical report creato con successo",
    type: MedicalReport,
  })
  @ApiResponse({
    status: 400,
    description: "Appuntamento cancellato o dati non validi",
  })
  @ApiResponse({
    status: 403,
    description: "Il medico non è autorizzato",
  })
  @ApiResponse({
    status: 404,
    description: "Appuntamento non trovato",
  })
  @ApiResponse({
    status: 409,
    description: "Esiste già un medical report per questo appuntamento",
  })
  async createMedicalReport(
    @Param("appointmentId") appointmentId: number,
    @Body() dto: CreateMedicalReportDto,
    @CurrentUser() user: UserDTO,
  ): Promise<MedicalReport> {
    return this.medicalReportsService.createMedicalReport(
      dto,
      appointmentId,
      user.sub,
    );
  }

  @Roles(RoleStatus.DOTTORE)
  @Patch("update/:id")
  @ApiOperation({
    summary: "Modifica il medical report di un appuntamento",
    description: "Il medico modifica il referto di una visita.",
  })
  @ApiParam({
    name: "appointmentId",
    type: Number,
    description: "ID dell'appuntamento",
    example: 12,
  })
  @ApiResponse({
    status: 200,
    description: "Referto medico aggiornato con successo",
    type: MedicalReport,
  })
  @ApiResponse({
    status: 403,
    description: "Utente non autorizzato a modificare il referto",
  })
  @ApiResponse({
    status: 404,
    description: "Referto medico non trovato",
  })
  @ApiResponse({
    status: 400,
    description: "Nessun campo valido da aggiornare",
  })
  @ApiResponse({
    status: 401,
    description: "Non autenticato",
  })
  update(
    @CurrentUser() user: UserDTO,
    @Param("id") reportId: string,
    @Body() updateMedicalReportDto: UpdateMedicalReportDto,
  ) {
    return this.medicalReportsService.update(
      user.sub,
      parseInt(reportId),
      updateMedicalReportDto,
    );
  }
}
