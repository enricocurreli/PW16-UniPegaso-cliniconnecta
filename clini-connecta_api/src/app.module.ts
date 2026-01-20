import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppointmentsModule } from "./appointments/appointments.module";
import { PatientsModule } from "./patients/patients.module";
import { UsersModule } from "./users/users.module";
import { DoctorsModule } from "./doctors/doctors.module";
import { SpecializationsModule } from "./specializations/specializations.module";
import { ClinicsModule } from "./clinics/clinics.module";
import { MedicalReportsModule } from "./medical-reports/medical-reports.module";
import { DoctorClinicsModule } from "./doctor-clinics/doctor-clinics.module";
import { PrescriptionsModule } from "./prescriptions/prescriptions.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "./users/entities/user.entity";
import { Patient } from "./patients/entities/patient.entity";
import { Doctor } from "./doctors/entities/doctor.entity";
import { Specialization } from "./specializations/entities/specialization.entity";
import { Clinic } from "./clinics/entities/clinic.entity";
import { DoctorClinic } from "./doctor-clinics/entities/doctor-clinic.entity";
import { Appointment } from "./appointments/entities/appointment.entity";
import { MedicalReport } from "./medical-reports/entities/medical-report.entity";
import { Prescription } from "./prescriptions/entities/prescription.entity";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/guard/authGuard.guard";
import { DoctorAvailabilityModule } from './doctor-availability/doctor-availability.module';
import { DoctorAvailability } from "./doctor-availability/entities/doctor-availability.entity";
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
    AppointmentsModule,
    UsersModule,
    AuthModule,
    PatientsModule,
    DoctorAvailabilityModule,
    SpecializationsModule,
    DoctorsModule,
    ClinicsModule,
    MedicalReportsModule,
    DoctorClinicsModule,
    PrescriptionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_NAME"),
        entities: [
          User,
          Patient,
          Doctor,
          Specialization,
          Clinic,
          DoctorClinic,
          Appointment,
          MedicalReport,
          Prescription,
          DoctorAvailability
        ],
        synchronize: configService.get<string>("NODE_ENV") === "development",
        logging: configService.get<string>("NODE_ENV") === "development",
      }),
    }),
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
