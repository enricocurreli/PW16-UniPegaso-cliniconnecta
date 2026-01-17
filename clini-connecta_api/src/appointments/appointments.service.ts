import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "./entities/appointment.entity";
import { DataSource, Repository } from "typeorm";
import { DoctorAvailability } from "../doctor-availability/entities/doctor-availability.entity";
import { UserDTO } from "../users/dto/user.dto";
import { Patient } from "../patients/entities/patient.entity";
import { GetAvailableSlotsDto } from "./dto/get-available-slots.dto";
import { AppointmentStatus, DayOfWeek } from "../enums/db-enum.enum";
import { SlotsService } from "./slots/slots.service";
import { AvailableSlotsResult } from "./types/available-slots.type";
import { GetAgendaDto } from "./dto/get-agenda.dto";

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointRepository: Repository<Appointment>,
    @InjectRepository(DoctorAvailability)
    private availabilityRepo: Repository<DoctorAvailability>,
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    private readonly slotsService: SlotsService,
    private dataSource: DataSource,
  ) {}

  //? SLOT DISPONIBILI
  async getAvailableSlots(
    query: GetAvailableSlotsDto,
  ): Promise<AvailableSlotsResult> {
    const { doctorId, clinicId, date } = query;
    const requestDate = new Date(date);
    const dayOfWeek = this.getDayOfWeek(requestDate);

    const availability = await this.availabilityRepo.findOne({
      where: {
        doctor: { id: doctorId },
        clinic: { id: clinicId },
        dayOfWeek,
        isActive: true,
      },
    });
    if (!availability) {
      throw new NotFoundException(
        "Nessuna disponibilità trovata per il medico nella clinica selezionata",
      );
    }
    if (
      availability.validFrom &&
      requestDate < new Date(availability.validFrom)
    ) {
      throw new BadRequestException(
        "Data precedente al periodo di validità della disponibilità",
      );
    }
    if (availability.validTo && requestDate > new Date(availability.validTo)) {
      throw new BadRequestException(
        "Data successiva al periodo di validità della disponibilità",
      );
    }

    //? recupero dal DB tutti i campi con i dati specifici in modo tale da verificare se un slot è disponibile o no con generateSlotsForTimeRange();
    //? Mando solo quelli con status CONFERMATO per non avere dei problemi logici con quelli che risultano CANCELLATI

    const bookedAppointments = await this.appointRepository.find({
      where: {
        doctor: { id: doctorId },
        clinic: { id: clinicId },
        appointmentDate: requestDate,
        status: AppointmentStatus.CONFERMATO,
      },
      select: ["appointmentTime", "durationMinutes"],
    });

    const slots = this.slotsService.generateSlots(
      availability.startTime,
      availability.endTime,
      50,
      bookedAppointments,
    );
    return {
      doctorId,
      clinicId,
      date: requestDate,
      dayOfWeek,
      availabilityId: availability.id,
      slots,
    };
  }

  async create(user: UserDTO, createAppointmentDto: CreateAppointmentDto) {
    const APPOINTMENT_DURATION = 50;

    const requestDate = new Date(createAppointmentDto.appointmentDate);
    const dayOfWeek = this.getDayOfWeek(requestDate);

    const patient = await this.patientRepository.findOne({
      where: { user: { id: user.sub } },
    });
    if (!patient) throw new NotFoundException("Paziente non trovato");

    // Questo metodo garantisce che una prenotazione venga fatta solo se, in quel preciso istante, nessun altro può farla prima di te
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // recupero gli appuntamenti già prenotati
      const bookedAppointments = await queryRunner.manager.find(Appointment, {
        where: {
          doctor: { id: createAppointmentDto.doctorId },
          clinic: { id: createAppointmentDto.clinicId },
          appointmentDate: requestDate,
          status: AppointmentStatus.CONFERMATO,
        },
        lock: { mode: "pessimistic_write" },
        select: ["appointmentTime", "durationMinutes"],
      });

      // recupero la disponibilità del medico
      const availability = await queryRunner.manager.findOne(
        DoctorAvailability,
        {
          where: {
            doctor: { id: createAppointmentDto.doctorId },
            clinic: { id: createAppointmentDto.clinicId },
            dayOfWeek,
            isActive: true,
          },
        },
      );

      if (!availability) {
        throw new NotFoundException(
          "Il medico non è disponibile nella data selezionata",
        );
      }

      if (
        availability.validFrom &&
        requestDate < new Date(availability.validFrom)
      ) {
        throw new BadRequestException("Data precedente al periodo di validità");
      }

      if (
        availability.validTo &&
        requestDate > new Date(availability.validTo)
      ) {
        throw new BadRequestException("Data successiva al periodo di validità");
      }

      // verifico slot richiesto
      const slotAvailable = this.slotsService.canBookSlot(
        createAppointmentDto.appointmentTime,
        APPOINTMENT_DURATION,
        bookedAppointments,
      );
      if (!slotAvailable) {
        throw new ConflictException("Lo slot selezionato non è disponibile");
      }

      const newAppointment = this.appointRepository.create({
        appointmentDate: requestDate,
        appointmentTime: createAppointmentDto.appointmentTime,
        durationMinutes: APPOINTMENT_DURATION,
        status: createAppointmentDto.status ?? AppointmentStatus.CONFERMATO,
        reason: createAppointmentDto.reason,
        notes: createAppointmentDto.notes,
        doctor: { id: createAppointmentDto.doctorId },
        clinic: { id: createAppointmentDto.clinicId },
        patient: patient,
      });

      const saved = await queryRunner.manager.save(newAppointment);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // metodo per associare una data ad un giorno della settimana
  private getDayOfWeek(date: Date): DayOfWeek {
    const days = [
      "DOMENICA",
      "LUNEDI",
      "MARTEDI",
      "MERCOLEDI",
      "GIOVEDI",
      "VENERDI",
      "SABATO",
    ];
    return days[date.getDay()] as DayOfWeek;
  }

  async getPatientAgenda(userId: number) {
    const patient = await this.patientRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!patient) throw new NotFoundException("Paziente non trovato");

    return this.appointRepository
      .createQueryBuilder("appointment")
      .innerJoin("appointment.patient", "patient")
      .leftJoinAndSelect("appointment.medicalReports", "medicalReport")
      .leftJoinAndSelect("medicalReport.prescriptionFiles", "prescriptions")
      .leftJoinAndSelect("appointment.doctor", "doctor")
      .leftJoinAndSelect("appointment.clinic", "clinic")
      .where("patient.id = :patientId", { patientId: patient.id })
      .orderBy("appointment.appointmentDate", "ASC")
      .addOrderBy("appointment.appointmentTime", "ASC")
      .getMany();
  }

  async getDoctorAgenda(doctorId: number, filters: GetAgendaDto) {
    const query = this.appointRepository
      .createQueryBuilder("appointment")
      .where("appointment.doctor_id = :doctorId", { doctorId });

    if (filters.fromDate) {
      query.andWhere("appointment.appointmentDate >= :fromDate", {
        fromDate: filters.fromDate,
      });
    }

    if (filters.toDate) {
      query.andWhere("appointment.appointmentDate <= :toDate", {
        toDate: filters.toDate,
      });
    }

    if (filters.status) {
      query.andWhere("appointment.status = :status", {
        status: filters.status,
      });
    }

    return query
      .orderBy("appointment.appointmentDate", "ASC")
      .addOrderBy("appointment.appointmentTime", "ASC")
      .getMany();
  }

  async remove(appointmentId: number, userId: number) {
    const appointment = await this.appointRepository.findOne({
      where: { id: appointmentId },
      relations: ["patient"],
    });
    if (!appointment) throw new NotFoundException("Appuntamento non trovato");

    if (appointment.patient.user.id != userId) {
      throw new ForbiddenException("Non puoi cancellare questo appuntamento");
    }

    const now = new Date();
    const appointmentDateTime = new Date(
      appointment.appointmentDate.toISOString().split("T")[0] +
        "T" +
        appointment.appointmentTime,
    );
    const cancelDeadline = new Date(
      // => 24 ore, 60 minuti per ora, 60 secondi per minuto, 1000 millesecondi per secondo
      appointmentDateTime.getTime() - 24 * 60 * 60 * 1000,
    );
    if (now >= cancelDeadline) {
      throw new BadRequestException(
        "Non puoi cancellare un appuntamento con meno di 24 ore di anticipo",
      );
    }

    appointment.status = AppointmentStatus.CANCELLATO;
    return this.appointRepository.save(appointment);
  }
}
