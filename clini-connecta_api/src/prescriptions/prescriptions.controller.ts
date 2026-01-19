import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
} from "@nestjs/common";
import { PrescriptionsService } from "./prescriptions.service";
import { CreatePrescriptionDto } from "./dto/create-prescription.dto";
import { UpdatePrescriptionDto } from "./dto/update-prescription.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserDTO } from "../users/dto/user.dto";
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleStatus } from "../enums/db-enum.enum";
import { Serialize } from "../interceptor/serializer.interceptor";
import { PrescriptionResponseDto } from "./dto/prescription-response.dto";
@ApiTags("Prescrizioni")
@Controller("prescriptions")
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Roles(RoleStatus.DOTTORE)
  @Post("upload/:id")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @CurrentUser() user: UserDTO,
    @Param("id") medicalRepoerId: string,
    @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }),
    ],
  })) file: Express.Multer.File,
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.create(
      user.sub,
      parseInt(medicalRepoerId),
      file,
      createPrescriptionDto,
    );
  }

@ApiOperation({ 
    summary: 'Recupera le prescrizioni di un referto',
    description: 'Restituisce tutte le prescrizioni associate a un referto specifico'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'ID del referto'
  })
  @ApiOkResponse({ 
    description: 'Prescrizioni recuperate con successo',
    type: PrescriptionResponseDto,
    isArray: true
  })
  @ApiNotFoundResponse({ 
    description: 'Referto non trovato'
  })
  @ApiUnauthorizedResponse({ 
    description: 'Non autorizzato'
  })
  @Serialize(PrescriptionResponseDto)
  @Get(":id")
  findPrescriptions(@CurrentUser() user: UserDTO, @Param("id") reportId: string) {
    return this.prescriptionsService.findPrescriptions(user.sub, parseInt(reportId));
  }
  
  @ApiOperation({ 
    summary: 'Elimina una prescrizione',
    description: 'Permette a un dottore di eliminare una prescrizione esistente'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    description: 'ID della prescrizione da eliminare'
  })
  @ApiOkResponse({ 
    description: 'Prescrizione eliminata con successo'
  })
  @ApiNotFoundResponse({ 
    description: 'Prescrizione non trovata'
  })
  @ApiUnauthorizedResponse({ 
    description: 'Non autorizzato'
  })
  @ApiForbiddenResponse({ 
    description: 'Accesso negato - richiesto ruolo Dottore'
  })
  @Roles(RoleStatus.DOTTORE)
  @Delete("delete/:id")
  remove(@CurrentUser() user: UserDTO, @Param("id") prescriptionId: string) {
    return this.prescriptionsService.remove(user.sub, parseInt(prescriptionId));
  }



  // @Get()
  // findAll() {
  //   return this.prescriptionsService.findAll();
  // }
  // @Patch(":id")
  // update(
  //   @Param("id") id: string,
  //   @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  // ) {
  //   return this.prescriptionsService.update(+id, updatePrescriptionDto);
  // }

}
