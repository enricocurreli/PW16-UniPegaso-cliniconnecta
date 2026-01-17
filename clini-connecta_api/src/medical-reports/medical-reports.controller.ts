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
@ApiTags("Medical Reports")
@ApiBearerAuth()
@Controller("medical-reports")
export class MedicalReportsController {
  constructor(private readonly medicalReportsService: MedicalReportsService) {}

  @Roles(RoleStatus.DOTTORE)
  @Post("appointments/:appointmentId")
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

  @Get()
  findAll() {
    return this.medicalReportsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.medicalReportsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateMedicalReportDto: UpdateMedicalReportDto,
  ) {
    return this.medicalReportsService.update(+id, updateMedicalReportDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.medicalReportsService.remove(+id);
  }
}
