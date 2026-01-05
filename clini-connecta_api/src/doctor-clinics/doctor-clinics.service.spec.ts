import { Test, TestingModule } from '@nestjs/testing';
import { DoctorClinicsService } from './doctor-clinics.service';

describe('DoctorClinicsService', () => {
  let service: DoctorClinicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorClinicsService],
    }).compile();

    service = module.get<DoctorClinicsService>(DoctorClinicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
