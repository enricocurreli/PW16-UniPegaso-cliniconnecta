import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateClinicDto } from "./dto/create-clinic.dto";
import { UpdateClinicDto } from "./dto/update-clinic.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Clinic } from "./entities/clinic.entity";
import { Repository } from "typeorm";

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic) private clinicRepository: Repository<Clinic>
  ) {}

  async create(createClinic: CreateClinicDto) {
    const existing = await this.clinicRepository.findOne({
      where: { name: createClinic.name, address: createClinic.address },
    });

    if (existing) {
      throw new ConflictException("Clinic already exists");
    }
    const clinic = this.clinicRepository.create(createClinic);
    return await this.clinicRepository.save(clinic);
  }

  async findAll() {
    return await this.clinicRepository.find({
      order: { name: "ASC" },
    });
  }

  async findOneById(id: number) {
    const clinic = await this.clinicRepository.findOne({
      where: { id },
    });
    if (!clinic) {
      throw new ConflictException("Clinic not found");
    }
    return clinic;
  }


  async findClinicbyQuery(
    name?: string,
    city?: string,
    address?: string,
    
  ) {
    const queryBuilder = this.clinicRepository
      .createQueryBuilder("clinics")
      .select("clinics")

    // `%${field}%` case-insensitive che permette di trovare nomi anche con ricerche parziali
    if (name) {
      queryBuilder.andWhere("LOWER(clinics.name) LIKE LOWER(:name)", {
        name: `%${name}%`,
      });
    }

    if (city) {
      queryBuilder.andWhere("LOWER(clinics.city) LIKE LOWER(:city)", {
        city: `%${city}%`,
      });
    }

    if (address) {
      queryBuilder.andWhere("LOWER(clinics.address) LIKE LOWER(:address)", {
        address: `%${address}%`,
      });
    }



    const clinics = await queryBuilder.getMany();

    if (!clinics || clinics.length === 0) {
      throw new NotFoundException(
        "Nessuna clinica trovata con i criteri specificati"
      );
    }

    return clinics;
  };


  async update(id: number, updateClinic: UpdateClinicDto) {
    const clinic =  await this.clinicRepository.findOne({
      where: { id },
    });
    if (!clinic) {
      throw new ConflictException("Clinic not found");
    }

    const updates = Object.fromEntries(
      Object.entries(updateClinic).filter(
        ([_,v])=>v !== undefined && v != null
      )
    );
    Object.assign(updateClinic,updates);
    return await this.clinicRepository.save(clinic);

  }

  async remove(id: number) {
    const result = await this.clinicRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    return { message: `Clinic with ID ${id} has been deleted` };
  }
}
