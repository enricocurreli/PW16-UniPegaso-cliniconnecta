import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Patient } from "./entities/patient.entity";
import { Repository } from "typeorm";
import CodiceFiscale from "codice-fiscale-js";

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>
  ) {}

  // recupera profilo paziente
  async getProfilebyUserId(userId: number) {
    const patient = this.patientRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }
    return patient;
  }

  // Aggiorna profilo paziente

  async updateProfile(userId: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.patientRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    // controllo solo se il campo fiscal code viene aggiornato
    if (
      updatePatientDto.fiscalCode &&
      updatePatientDto.fiscalCode !== patient.fiscalCode
    ) {
      const existingPatient = await this.patientRepository.findOne({
        where: { fiscalCode: updatePatientDto.fiscalCode },
      });

      if (existingPatient) {
        throw new ConflictException(
          "Fiscal code already exists. Please use a different value."
        );
      }
    }

    const updates = Object.fromEntries(
      Object.entries(updatePatientDto).filter(
        ([_, v]) => v !== undefined && v !== null
      )
    );
    Object.assign(patient, updates);
    await this.patientRepository.save(patient);

    if (
      !patient.fiscalCode &&
      patient.firstName &&
      patient.lastName &&
      patient.dateOfBirth &&
      patient.gender &&
      patient.cityOfBirth
    ) {
      const generatedFiscalCode = this.GenerateCodiceFiscale(patient);
      const existingPatient = await this.patientRepository.findOne({
        where: { fiscalCode: generatedFiscalCode },
      });
      if (!existingPatient) {
        patient.fiscalCode = generatedFiscalCode;
        await this.patientRepository.save(patient);
      }
    }
    return patient;
  }

  // metodo per dottori e admin recupero dei pazienti
  async findAll() {
    return await this.patientRepository.find({
      relations: ["user"],
      order: {
        id: "DESC",
      },
    });
  }

  // Dettaglio paziente per ID (admin/dottori)
  async findOne(id: number) {
    const patient = await this.patientRepository.findOne({
      where: { id },
      // TypeORM carica anche l'entità user collegata al paziente
      relations: ["user"],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  // Rimozione pazienti solo admin
  async remove(id: number) {
    const result = await this.patientRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return { message: `Patient with ID ${id} has been deleted` };
  }

  // CF GENERATION

  private GenerateCodiceFiscale(patient: Patient): string {
    if (patient.dateOfBirth) {
      const dateOfBirth = patient.dateOfBirth.toString();
      const [year, month, day] = dateOfBirth.split("-");

      const cf = CodiceFiscale.compute({
        name: patient.firstName,
        surname: patient.lastName,
        gender: patient.gender,
        day: parseInt(day),
        month: parseInt(month),
        year: parseInt(year),
        birthplace: patient.cityOfBirth,
        birthplaceProvincia: patient.provinceOfBirth,
      });
      return cf;
    }
    throw new Error("Impossibile generare il codice fiscale");
  }
  private validateCodiceFiscale(codiceFiscale: string): boolean {
    return CodiceFiscale.check(codiceFiscale);
  }
}
