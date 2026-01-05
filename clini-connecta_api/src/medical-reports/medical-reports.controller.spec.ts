import { Test, TestingModule } from '@nestjs/testing';
import { MedicalReportsController } from './medical-reports.controller';
import { MedicalReportsService } from './medical-reports.service';

describe('MedicalReportsController', () => {
  let controller: MedicalReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalReportsController],
      providers: [MedicalReportsService],
    }).compile();

    controller = module.get<MedicalReportsController>(MedicalReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
