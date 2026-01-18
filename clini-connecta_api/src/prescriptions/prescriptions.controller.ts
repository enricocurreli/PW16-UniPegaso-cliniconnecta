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
  FileTypeValidator,
} from "@nestjs/common";
import { PrescriptionsService } from "./prescriptions.service";
import { CreatePrescriptionDto } from "./dto/create-prescription.dto";
import { UpdatePrescriptionDto } from "./dto/update-prescription.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserDTO } from "../users/dto/user.dto";
import { ApiTags } from "@nestjs/swagger";
@ApiTags("Prescrizioni")
@Controller("prescriptions")
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post("upload/:id")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @CurrentUser() user: UserDTO,
    @Param("id") medicalRepoerId: string,
    @UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }),
      new FileTypeValidator({ fileType: 'pdf' }),
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

  @Get()
  findAll() {
    return this.prescriptionsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.prescriptionsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(+id, updatePrescriptionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.prescriptionsService.remove(+id);
  }
}
