import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialization } from './entities/specialization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
  ) {}
  async create(createSpecializationDto: CreateSpecializationDto) {
    const existing = await this.specializationRepository.findOne({
      where: { name: createSpecializationDto.name }
    });
    
    if (existing) {
      throw new ConflictException('Specialization already exists');
    }

    const specialization = this.specializationRepository.create(createSpecializationDto);
    return await this.specializationRepository.save(specialization);
  }

  async findAll() {
    return await this.specializationRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number) {
    return await this.specializationRepository.findOne({
      where: { id }
    });
  }

    async remove(id: number) {
      const result = await this.specializationRepository.delete(id);
  
      if (result.affected === 0) {
        throw new NotFoundException(`Specialization with ID ${id} not found`);
      }
  
      return { message: `Specialization with ID ${id} has been deleted` };
    }
}
