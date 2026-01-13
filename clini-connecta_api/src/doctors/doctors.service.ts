import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Doctor } from "./entities/doctor.entity";
import { Repository } from "typeorm";
import { Specialization } from "../specializations/entities/specialization.entity";

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>
  ) {}

  async findbyId(user_id: number) {
    const doctor = await this.doctorRepository
      .createQueryBuilder("doctor")
      .leftJoinAndSelect("doctor.user", "user")
      .leftJoinAndSelect("doctor.specialization", "specialization")
      .leftJoinAndSelect("doctor.availabilities", "availabilities")
      .leftJoinAndSelect("availabilities.clinic", "clinic")
      .select([
        "doctor.id",
        "doctor.firstName",
        "doctor.lastName",
        "doctor.bio",
        "doctor.phone",
        "doctor.licenseNumber",
        "specialization.id",
        "specialization.name",
        "user.id",
        "user.email",
        "user.role",
        "user.createdAt",
        "user.updatedAt",
        "availabilities.id",
        "availabilities.dayOfWeek",
        "availabilities.startTime",
        "availabilities.endTime",
        "availabilities.validFrom",
        "availabilities.validTo",
        "availabilities.isActive",
        "availabilities.createdAt",
        "availabilities.updatedAt",
        "clinic.id",
        "clinic.name",
        "clinic.address",
      ])
      .where("user.id = :user_id", { user_id })
      .getOne();

    if (!doctor) {
      throw new NotFoundException("Doctor profile not found");
    }
    return doctor;
  }

  // Pazienti

  async findbyQuery(
    firstName?: string,
    lastName?: string,
    email?: string,
    specialization?: string
  ) {
    // Cosi da visualizzare anche la parte user e specialization, altrimenti non vedrei l'email
    const queryBuilder = this.doctorRepository
      .createQueryBuilder("doctor")
      .leftJoinAndSelect("doctor.user", "user")
      .leftJoinAndSelect("doctor.specialization", "specialization");

    // `%${field}%` case-insensitive che permette di trovare nomi anche con ricerche parziali
    if (firstName) {
      queryBuilder.andWhere("LOWER(doctor.firstName) LIKE LOWER(:firstName)", {
        firstName: `%${firstName}%`,
      });
    }

    if (lastName) {
      queryBuilder.andWhere("LOWER(doctor.lastName) LIKE LOWER(:lastName)", {
        lastName: `%${lastName}%`,
      });
    }

    if (email) {
      queryBuilder.andWhere("LOWER(user.email) LIKE LOWER(:email)", {
        email: `%${email}%`,
      });
    }

    if (specialization) {
      queryBuilder.andWhere(
        "LOWER(specialization.name) LIKE LOWER(:specialization)",
        {
          specialization: `%${specialization}%`,
        }
      );
    }

    const doctors = await queryBuilder.getMany();

    if (!doctors || doctors.length === 0) {
      throw new NotFoundException(
        "Nessun medico trovato con i criteri specificati"
      );
    }

    return doctors;
  }

  // public
  async findAll() {
    return await this.doctorRepository.find({
      relations: ["user", "specialization"],
      order: {
        firstName: "DESC",
      },
    });
  }

  // Aggiorna profilo medico
  async updateProfile(user_id: number, updateDoctor: UpdateDoctorDto) {
    //TODO: recupero il medico e verifico che esista
    const doctor = await this.doctorRepository.findOne({
      where: { user: { id: user_id } },
      relations: ["user", "specialization"],
    });
    if (!doctor) {
      throw new NotFoundException("Doctor profile not found");
    }
    //TODO: Verifico che la specializzazione inserita sia tra quelle disponibili. PS: Nel frontend inseriro' menu' a tendina senza dare la possibilità dia ggiungere un valore manuale.
    if (updateDoctor.specialization) {
      const specialization = await this.specializationRepository.findOne({
        where: { name: updateDoctor.specialization },
      });

      if (!specialization) {
        throw new NotFoundException("Specialization not found");
      }

      doctor.specialization = specialization;
    }

    const { specialization, ...otherUpdates } = updateDoctor;
    //TODO: pulizia dei valori undifined o null per non rischiare sovrascrizione, cosi facendo prendo solo i valori effettivamente modificati
    const updates = Object.fromEntries(
      Object.entries(otherUpdates).filter(
        ([_, v]) => v !== undefined && v !== null
      )
    );

    Object.assign(doctor, updates);

    await this.doctorRepository.save(doctor);

    const finalDoctor = await this.doctorRepository.findOne({
      where: { id: doctor.id },
      relations: ["specialization", "user"],
    });

    return finalDoctor;
  }

  // Rimozione medici solo admin
  async remove(id: number) {
    const result = await this.doctorRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return { message: `Doctor with ID ${id} has been deleted` };
  }
}
