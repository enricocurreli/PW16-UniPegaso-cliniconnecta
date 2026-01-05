import { Test, TestingModule } from '@nestjs/testing';
import { MedicalReportsService } from './medical-reports.service';

describe('MedicalReportsService', () => {
  let service: MedicalReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalReportsService],
    }).compile();

    service = module.get<MedicalReportsService>(MedicalReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
