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

  async getMedicalReports(userId: number) {
    const reports = await this.medicalReportRepository.find({
      where: { appointment: { doctor: { user: { id: userId } } } },
    });

    return reports;
  }

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
      throw new NotFoundException("Appointment not found");
    }
    if (appointment.doctor.user.id !== doctorId) {
      throw new ForbiddenException(
        "You are not authorized to complete this report",
      );
    }
    if (appointment.status === AppointmentStatus.CANCELLATO) {
      throw new BadRequestException(
        "You can't create a report for a cancelled appointment",
      );
    }
    if (appointment.medicalReport) {
      throw new ConflictException(
        "There is already a report for this appointment",
      );
    }

    const report = this.medicalReportRepository.create({
      reportType: createMedicalReportDto.reportType,
      title: createMedicalReportDto.title,
      diagnosis: createMedicalReportDto.diagnosis,
      treatment: createMedicalReportDto.treatment || null,
      appointment: appointment,
    });

    const savedReport = await this.medicalReportRepository.save(report);

    appointment.status = AppointmentStatus.COMPLETATO;

    await this.appointmentRepository.update(
      { id: appointmentId },
      { status: AppointmentStatus.COMPLETATO },
    );

    return savedReport;
  }

  async update(userId: number, reportId: number, dto: UpdateMedicalReportDto) {
    const report = await this.medicalReportRepository.findOne({
      where: { id: reportId },
      relations: ["appointment", "appointment.doctor"],
    });
    if (!report) {
      throw new NotFoundException("Appointment not found");
    }

    if (report.appointment.doctor.user.id != userId) {
      throw new ForbiddenException(
        "You are not authorized to update this report",
      );
    }

    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined) {
        report[key] = value;
      }
    });

    await this.medicalReportRepository.save(report);
    return await this.medicalReportRepository.findOne({
      where: { id: reportId },
    });
  }
}
