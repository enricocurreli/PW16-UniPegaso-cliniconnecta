import { Module } from "@nestjs/common";
import { PrescriptionsService } from "./prescriptions.service";
import { PrescriptionsController } from "./prescriptions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Prescription } from "./entities/prescription.entity";
import { MedicalReport } from "../medical-reports/entities/medical-report.entity";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Module({
  imports: [
    TypeOrmModule.forFeature([Prescription, MedicalReport]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req,file,cb) =>{
          const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extname(file.originalname)}`;
          cb(null,filename);
        }
      })
    }),
  ],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
})
export class PrescriptionsModule {}
