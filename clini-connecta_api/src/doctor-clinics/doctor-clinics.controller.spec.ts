import { Test, TestingModule } from '@nestjs/testing';
import { DoctorClinicsController } from './doctor-clinics.controller';
import { DoctorClinicsService } from './doctor-clinics.service';

describe('DoctorClinicsController', () => {
  let controller: DoctorClinicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorClinicsController],
      providers: [DoctorClinicsService],
    }).compile();

    controller = module.get<DoctorClinicsController>(DoctorClinicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
