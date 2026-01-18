import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePrescriptionDto } from "./dto/create-prescription.dto";
import { UpdatePrescriptionDto } from "./dto/update-prescription.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Prescription } from "./entities/prescription.entity";
import { Repository } from "typeorm";
import { MedicalReport } from "../medical-reports/entities/medical-report.entity";

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
    @InjectRepository(MedicalReport)
    private medicalReportRepository: Repository<MedicalReport>,
  ) {}
  async create(
    userId: number,
    medicalRepoerId: number,
    file: Express.Multer.File,
    createPrescriptionDto: CreatePrescriptionDto,
  ) {
    const report = await this.medicalReportRepository.findOne({
      where: { id: medicalRepoerId },
      relations: ["doctor", "appointment"],
    });
    if (!report) {
      throw new NotFoundException("Report not found");
    }
    if (report.appointment.doctor.user.id !== userId) {
      throw new ForbiddenException(
        "You are not authorized to complete this report",
      );
    }

    
    
  }

  findAll() {
    return `This action returns all prescriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prescription`;
  }

  update(id: number, updatePrescriptionDto: UpdatePrescriptionDto) {
    return `This action updates a #${id} prescription`;
  }

  remove(id: number) {
    return `This action removes a #${id} prescription`;
  }
}
