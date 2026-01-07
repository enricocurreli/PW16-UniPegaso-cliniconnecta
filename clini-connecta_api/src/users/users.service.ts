import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Patient } from "../patients/entities/patient.entity";
import { Doctor } from "../doctors/entities/doctor.entity";
import { RoleStatus } from "../enums/db-enum.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, role, firstName, lastName } = createUserDto;
    const exsistingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (exsistingUser) {
      throw new ConflictException("Email already registered");
    }
    // user base creato
    const user = this.userRepository.create({
      email,
      password,
      role,
    });

    const savedUser = await this.userRepository.save(user);
    
    if (role === RoleStatus.PAZIENTE) {
      const patient = this.patientRepository.create({
        firstName,
        lastName,
        user: savedUser,
      });
      await this.patientRepository.save(patient);
    } else if (role === RoleStatus.DOTTORE) {
      const doctor = this.doctorRepository.create({
        firstName,
        lastName,
        user: savedUser,
      });
      await this.doctorRepository.save(doctor);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
