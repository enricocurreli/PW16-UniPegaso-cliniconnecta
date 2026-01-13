import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateDoctorAvailabilityDto } from "./dto/update-doctor-availability.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DoctorAvailability } from "./entities/doctor-availability.entity";
import { Repository } from "typeorm";
import { CreateDoctorAvailabilityDto } from "./dto/create-doctor-availability.dto";
import { UserDTO } from "../users/dto/user.dto";
import { Doctor } from "../doctors/entities/doctor.entity";

@Injectable()
export class DoctorAvailabilityService {
  constructor(
    @InjectRepository(DoctorAvailability)
    private docAvailabilityrepo: Repository<DoctorAvailability>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>
  ) {}

  async createAvailability(
    user: UserDTO,
    createDoctorAvailability: CreateDoctorAvailabilityDto
  ) {
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: user.sub } },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found for this user");
    }

    const availability = this.docAvailabilityrepo.create({
      ...createDoctorAvailability,
      clinic: { id: createDoctorAvailability.clinic_id },
      doctor: { id: doctor.id },
    });

    return this.docAvailabilityrepo.save(availability);
  }

  async findAllByDoc(user_id: number) {
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: user_id } },
      relations: ["availabilities", "availabilities.clinic"],
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found for this user");
    }
    return doctor.availabilities;
  }

  // update(id: number, updateDoctorAvailabilityDto: UpdateDoctorAvailabilityDto) {
  //   return `This action updates a #${id} doctorAvailability`;
  // }

  async remove(availabilityId: number, user: UserDTO) {
    
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: user.sub } },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    
    const availability = await this.docAvailabilityrepo.findOne({
      where: { id: availabilityId },
      relations: ["doctor"],
    });

    if (!availability) {
      throw new NotFoundException("Availability not found");
    }


    if (availability.doctor.id !== doctor.id) {
      throw new ForbiddenException(
        "You can only delete your own availabilities"
      );
    }

    await this.docAvailabilityrepo.remove(availability);

    return { message: "Availability deleted successfully" };
  }
}
