import {
  BadRequestException,
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
    medicalReportId: number,
    file: Express.Multer.File,
    createPrescriptionDto: CreatePrescriptionDto,
  ) {
    const report = await this.medicalReportRepository.findOne({
      where: { id: medicalReportId },
      relations: ["appointment", "appointment.doctor"],
    });
    if (!report) {
      throw new NotFoundException("Report not found");
    }
    if (report.appointment.doctor.user.id !== userId) {
      throw new ForbiddenException(
        "You are not authorized to complete this report",
      );
    }
    if (file.mimetype !== "application/pdf") {
      throw new BadRequestException("File non valido: deve essere un PDF");
    }
    const prescription = this.prescriptionRepository.create({
      ...createPrescriptionDto,
      filePath: file.path,
      report: { id: medicalReportId },
    });

    return this.prescriptionRepository.save(prescription);
  }
  async findPrescriptions(userId: number, reportId: number) {
    const prescriptions = await this.prescriptionRepository.find({
      where: { report: { id: reportId } },
      relations: [
        "report",
        "report.appointment",
        "report.appointment.doctor",
        "report.appointment.patient",
      ],
    });

    if (prescriptions.length === 0) {
      throw new NotFoundException("Prescriptions not found");
    }

    if (
      prescriptions[0].report.appointment.doctor.user.id != userId &&
      prescriptions[0].report.appointment.patient.user.id != userId
    ) {
      throw new ForbiddenException(
        "You are not authorized to see these reports"
      );
    }
    const result = prescriptions.map((prescription)=> {

      return {...prescription, reportId};
       
    })
    return result;
  }

  async remove(userId: number, prescriptionId: number) {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id: prescriptionId },
      relations: ["report", "report.appointment", "report.appointment.doctor"],
    });

    if (!prescription) {
      throw new NotFoundException("Prescription not found");
    }

    if (prescription.report.appointment.doctor.user.id !== userId) {
      throw new ForbiddenException(
        "You are not authorized to delete this report",
      );
    }

    await this.prescriptionRepository.remove(prescription);
    return { message: "Prescription deleted successfully" };
  }

  findAll() {
    return `This action returns all prescriptions`;
  }

  update(id: number, updatePrescriptionDto: UpdatePrescriptionDto) {
    return `This action updates a #${id} prescription`;
  }
}
