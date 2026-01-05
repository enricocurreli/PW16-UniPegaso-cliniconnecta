import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { PatientsModule } from './patients/patients.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { AdminsModule } from './admins/admins.module';
import { ClinicsModule } from './clinics/clinics.module';
import { MedicalReportsModule } from './medical-reports/medical-reports.module';
import { DoctorClinicsModule } from './doctor-clinics/doctor-clinics.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';

@Module({
  imports: [UsersModule, AppointmentsModule, PatientsModule, UsersModule, DoctorsModule, SpecializationsModule, AdminsModule, ClinicsModule, MedicalReportsModule, DoctorClinicsModule, PrescriptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
