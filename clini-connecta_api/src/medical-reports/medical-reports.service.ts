import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateMedicalReportDto } from "./dto/create-medical-report.dto";
import { UpdateMedicalReportDto } from "./dto/update-medical-report.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MedicalReport } from "./entities/medical-report.entity";
import { Repository } from "typeorm";
import { Appointment } from "../appointments/entities/appointment.entity";
import { AppointmentStatus } from "../enums/db-enum.enum";

@Injectable()
export class MedicalReportsService {
  constructor(
    @InjectRepository(MedicalReport)
    private readonly medicalReportRepository: Repository<MedicalReport>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async createMedicalReport(
    createMedicalReportDto: CreateMedicalReportDto,
    appointmentId: number,
    doctorId: number,
  ): Promise<MedicalReport> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ["doctor", "medicalReport"],
    });
    if (!appointment) {
      throw new NotFoundException("Appuntamento non trovato");
    }
    if (appointment.doctor.id !== doctorId) {
      throw new ForbiddenException(
        "Non sei autorizzato a compilare questo referto",
      );
    }
    if (appointment.status === AppointmentStatus.CANCELLATO) {
      throw new BadRequestException(
        "Non puoi creare un referto per un appuntamento cancellato",
      );
    }
    if (appointment.medicalReport) {
      throw new ConflictException(
        "Esiste già un referto per questo appuntamento",
      );
    }

    const report = this.medicalReportRepository.create({
      ...createMedicalReportDto,
      appointment,
    });
    await this.medicalReportRepository.save(report);
    appointment.status = AppointmentStatus.COMPLETATO;
    await this.appointmentRepository.save(appointment);
    return report;
  }

  findAll() {
    return `This action returns all medicalReports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicalReport`;
  }

  update(id: number, updateMedicalReportDto: UpdateMedicalReportDto) {
    return `This action updates a #${id} medicalReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalReport`;
  }
}
