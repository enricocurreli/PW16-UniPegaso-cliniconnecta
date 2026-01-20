import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

import { User } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Clinic } from '../clinics/entities/clinic.entity';
import { Specialization } from '../specializations/entities/specialization.entity';
import { DoctorClinic } from '../doctor-clinics/entities/doctor-clinic.entity';
import { DoctorAvailability } from '../doctor-availability/entities/doctor-availability.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { MedicalReport } from '../medical-reports/entities/medical-report.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import {
  RoleStatus,
  Gender,
  AppointmentStatus,
  DayOfWeek,
  ReportType,
} from '../enums/db-enum.enum';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    @InjectRepository(Clinic)
    private clinicRepo: Repository<Clinic>,
    @InjectRepository(Specialization)
    private specializationRepo: Repository<Specialization>,
    @InjectRepository(DoctorClinic)
    private doctorClinicRepo: Repository<DoctorClinic>,
    @InjectRepository(DoctorAvailability)
    private availabilityRepo: Repository<DoctorAvailability>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(MedicalReport)
    private medicalReportRepo: Repository<MedicalReport>,
    @InjectRepository(Prescription)
    private prescriptionRepo: Repository<Prescription>,
  ) {}

  async run() {
    console.log('🌱 Inizio seeding database CliniConnecta...');

    // SPECIALIZZAZIONI
    console.log('📋 Creazione specializzazioni...');
    const specializations = await this.createSpecializations();
    console.log(`✅ Create ${specializations.length} specializzazioni`);

    // CLINICHE
    console.log('🏥 Creazione cliniche...');
    const clinics = await this.createClinics(15);
    console.log(`✅ Create ${clinics.length} cliniche`);

    // UTENTI E PAZIENTI
    console.log('👥 Creazione pazienti...');
    const patients = await this.createPatients(200);
    console.log(`✅ Creati ${patients.length} pazienti`);

    // UTENTI E MEDICI
    console.log('👨‍⚕️ Creazione medici...');
    const doctors = await this.createDoctors(60, specializations);
    console.log(`✅ Creati ${doctors.length} medici`);

    // RELAZIONE MANY-TO-MANY DOCTOR-CLINIC
    console.log('🔗 Creazione relazioni medico-clinica...');
    const doctorClinics = await this.createDoctorClinics(doctors, clinics);
    console.log(`✅ Create ${doctorClinics.length} relazioni medico-clinica`);

    //  DISPONIBILITÀ MEDICI
    console.log('📅 Creazione disponibilità medici...');
    const availabilities = await this.createDoctorAvailabilities(
      doctors,
      doctorClinics,
    );
    console.log(`✅ Create ${availabilities.length} disponibilità`);

    // 7. APPUNTAMENTI
    console.log('📆 Creazione appuntamenti...');
    const appointments = await this.createAppointments(
      doctors,
      patients,
      clinics,
      400,
    );
    console.log(`✅ Creati ${appointments.length} appuntamenti`);

    // REPORT MEDICI
    console.log('📄 Creazione report medici...');
    const reports = await this.createMedicalReports(appointments);
    console.log(`✅ Creati ${reports.length} report medici`);

    //  PRESCRIZIONI CON FILE PDF
    console.log('💊 Creazione prescrizioni con PDF...');
    const prescriptions = await this.createPrescriptions(reports);
    console.log(`✅ Create ${prescriptions.length} prescrizioni`);

    console.log('\n🎉 Seeding completato con successo!');
    console.log('\n📊 Riepilogo dati generati:');
    console.log(`   - ${specializations.length} specializzazioni`);
    console.log(`   - ${clinics.length} cliniche`);
    console.log(`   - ${patients.length} pazienti`);
    console.log(`   - ${doctors.length} medici`);
    console.log(`   - ${doctorClinics.length} relazioni medico-clinica`);
    console.log(`   - ${availabilities.length} slot di disponibilità`);
    console.log(`   - ${appointments.length} appuntamenti`);
    console.log(`   - ${reports.length} report medici`);
    console.log(`   - ${prescriptions.length} prescrizioni con PDF\n`);
  }


  private async createSpecializations(): Promise<Specialization[]> {
    const specializations = [
      'Cardiologia',
      'Dermatologia',
      'Pediatria',
      'Ortopedia',
      'Neurologia',
      'Psichiatria',
      'Oculistica',
      'Otorinolaringoiatria',
      'Ginecologia',
      'Urologia',
      'Endocrinologia',
      'Gastroenterologia',
      'Pneumologia',
      'Oncologia',
      'Medicina Generale',
    ];

    const entities = specializations.map((name) =>
      this.specializationRepo.create({ name }),
    );

    return this.specializationRepo.save(entities);
  }

  private async createClinics(count: number): Promise<Clinic[]> {
    const cities = [
      'Milano',
      'Roma',
      'Napoli',
      'Torino',
      'Palermo',
      'Genova',
      'Bologna',
      'Firenze',
      'Bari',
      'Catania',
      'Venezia',
      'Verona',
      'Cagliari',
      'Sassari',
      'Olbia',
    ];

    const clinics = faker.helpers.multiple(
      () => {
        const city = faker.helpers.arrayElement(cities);
        return this.clinicRepo.create({
          name: `${faker.helpers.arrayElement(['Centro Medico', 'Poliambulatorio', 'Clinica', 'Casa di Cura'])} ${faker.person.lastName()}`,
          address: `Via ${faker.person.lastName()}, ${faker.number.int({ min: 1, max: 200 })}`,
          city: city,
          postalCode: faker.location.zipCode('#####'),
          phone: faker.phone.number({ style: 'international' }),
        });
      },
      { count },
    );

    return this.clinicRepo.save(clinics);
  }

  private async createPatients(count: number): Promise<Patient[]> {
    const patients: Patient[] = [];

    for (let i = 0; i < count; i++) {
      const gender = faker.helpers.arrayElement([
        Gender.MASCHIO,
        Gender.FEMMINA,
      ]);
      const firstName =
        gender === Gender.MASCHIO
          ? faker.person.firstName('male')
          : faker.person.firstName('female');
      const lastName = faker.person.lastName();
      const email = faker.internet
        .email({
          firstName,
          lastName,
          provider: 'patient.com',
        })
        .toLowerCase();

      // Crea User
      const user = this.userRepo.create({
        email: email,
        password: await bcrypt.hash('Password12345!', 10),
        role: RoleStatus.PAZIENTE,
      });
      const savedUser = await this.userRepo.save(user);

      // Crea Patient
      const patient = this.patientRepo.create({
        firstName,
        lastName,
        dateOfBirth: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
        cityOfBirth: faker.location.city(),
        provinceOfBirth: faker.location.state({ abbreviated: true }),
        gender,
        phone: faker.phone.number({ style: 'international' }),
        fiscalCode: faker.string.alphanumeric(16).toUpperCase(),
        address: `Via ${faker.person.lastName()}, ${faker.number.int({ min: 1, max: 200 })}`,
        user: savedUser,
      });

      patients.push(patient);
    }

    return await this.patientRepo.save(patients);
  }

  private async createDoctors(
    count: number,
    specializations: Specialization[],
  ): Promise<Doctor[]> {
    const doctors: Doctor[] = [];

    for (let i = 0; i < count; i++) {
      const gender = faker.helpers.arrayElement(['male', 'female']);
      const firstName = faker.person.firstName(gender);
      const lastName = faker.person.lastName();
      const email = faker.internet
        .email({
          firstName,
          lastName,
          provider: 'clinicconnecta.com',
        })
        .toLowerCase();

      // Crea User
      const user = this.userRepo.create({
        email: email,
        password: await bcrypt.hash('Password123!', 10),
        role: RoleStatus.DOTTORE,
      });
      const savedUser = await this.userRepo.save(user);

      // Crea Doctor
      const doctor = this.doctorRepo.create({
        firstName,
        lastName,
        phone: faker.phone.number({ style: 'international' }),
        bio: faker.lorem.paragraph({ min: 2, max: 4 }),
        licenseNumber: `OMCeO-${faker.string.numeric(6)}`,
        specialization: faker.helpers.arrayElement(specializations),
        user: savedUser,
      });

      doctors.push(doctor);
    }

    return await this.doctorRepo.save(doctors);
  }

  private async createDoctorClinics(
    doctors: Doctor[],
    clinics: Clinic[],
  ): Promise<DoctorClinic[]> {
    const doctorClinics: DoctorClinic[] = [];

    for (const doctor of doctors) {
      // Ogni medico lavora in 1-4 cliniche
      const selectedClinics = faker.helpers.arrayElements(clinics, {
        min: 1,
        max: 4,
      });

      for (const clinic of selectedClinics) {
        const dc = this.doctorClinicRepo.create({
          doctor,
          clinic,
        });
        doctorClinics.push(dc);
      }
    }

    return this.doctorClinicRepo.save(doctorClinics);
  }

  private async createDoctorAvailabilities(
    doctors: Doctor[],
    doctorClinics: DoctorClinic[],
  ): Promise<DoctorAvailability[]> {
    const availabilities: DoctorAvailability[] = [];

    // Raggruppa DoctorClinic per dottore
    const doctorClinicsMap = new Map<number, DoctorClinic[]>();
    for (const dc of doctorClinics) {
      if (!doctorClinicsMap.has(dc.doctor.id)) {
        doctorClinicsMap.set(dc.doctor.id, []);
      }
      doctorClinicsMap.get(dc.doctor.id)?.push(dc);
    }

    for (const doctor of doctors) {
      const dcs = doctorClinicsMap.get(doctor.id) || [];

      for (const dc of dcs) {
        // 2-3 giorni di disponibilità per clinica
        const days = faker.helpers.arrayElements(
          [
            DayOfWeek.Lunedì,
            DayOfWeek.Martedì,
            DayOfWeek.Mercoledì,
            DayOfWeek.Giovedì,
            DayOfWeek.Venerdì,
          ],
          { min: 2, max: 3 },
        );

        for (const day of days) {
          const startHour = faker.helpers.arrayElement([8, 9, 14]);
          const endHour = startHour < 12 ? 13 : faker.helpers.arrayElement([18, 19]);

          const availability = this.availabilityRepo.create({
            doctor: dc.doctor,
            clinic: dc.clinic,
            dayOfWeek: day,
            startTime: `${String(startHour).padStart(2, '0')}:00`,
            endTime: `${String(endHour).padStart(2, '0')}:00`,
            validFrom: faker.date.recent({ days: 30 }),
            validTo: faker.date.future({ years: 1 }),
            isActive: true,
          });
          availabilities.push(availability);
        }
      }
    }

    return this.availabilityRepo.save(availabilities);
  }

  private async createAppointments(
    doctors: Doctor[],
    patients: Patient[],
    clinics: Clinic[],
    count: number,
  ): Promise<Appointment[]> {
    const appointments: Appointment[] = [];

    // Recupera le relazioni doctor-clinic
    const doctorClinics = await this.doctorClinicRepo.find({
      relations: ['doctor', 'clinic'],
    });

    for (let i = 0; i < count; i++) {
      const dc = faker.helpers.arrayElement(doctorClinics);
      const patient = faker.helpers.arrayElement(patients);

      // Data random: 60% negli ultimi 3 mesi (passati), 40% nei prossimi 2 mesi
      const isHistorical = faker.datatype.boolean({ probability: 0.6 });
      const appointmentDate = isHistorical
        ? faker.date.recent({ days: 90 })
        : faker.date.soon({ days: 60 });

      const appointment = this.appointmentRepo.create({
        doctor: dc.doctor,
        patient,
        clinic: dc.clinic,
        appointmentDate,
        appointmentTime: faker.helpers.arrayElement([
          '09:00',
          '10:00',
          '11:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
        ]),
        durationMinutes: 50,
        status: isHistorical
          ? faker.helpers.arrayElement([
              AppointmentStatus.COMPLETATO,
              AppointmentStatus.COMPLETATO,
              AppointmentStatus.CANCELLATO,
            ])
          : faker.helpers.arrayElement([
              AppointmentStatus.CONFERMATO,
              AppointmentStatus.CONFERMATO,
              AppointmentStatus.CONFERMATO,
              AppointmentStatus.CANCELLATO,
            ]),
        reason: faker.helpers.arrayElement([
          'VISITA DI CONTROLLO',
          'PRIMA VISITA',
        ]),
        notes: faker.datatype.boolean({ probability: 0.3 })
          ? faker.lorem.paragraph()
          : null,
      });

      appointments.push(appointment);
    }

    return this.appointmentRepo.save(appointments);
  }

  private async createMedicalReports(
    appointments: Appointment[],
  ): Promise<MedicalReport[]> {
    // Solo appuntamenti completati hanno report
    const completedAppointments = appointments.filter(
      (app) => app.status === AppointmentStatus.COMPLETATO,
    );

    const reports = completedAppointments.map((appointment) => {
      const reportType = faker.helpers.weightedArrayElement([
        { weight: 7, value: ReportType.PRIMA_VISITA },
        { weight: 3, value: ReportType.VISITA_DI_CONTROLLO },
      ]);

      return this.medicalReportRepo.create({
        appointment,
        appointmentId: appointment.id,
        reportType,
        title: `${reportType} - ${appointment.reason}`,
        diagnosis: faker.lorem.paragraph({ min: 2, max: 5 }),
        treatment: faker.datatype.boolean({ probability: 0.7 })
          ? faker.lorem.paragraph({ min: 1, max: 3 })
          : null,
      });
    });

    return this.medicalReportRepo.save(reports);
  }

  private async createPrescriptions(
    reports: MedicalReport[],
  ): Promise<Prescription[]> {
    const prescriptions: Prescription[] = [];

    // Assicurati che esista la directory per i file PDF
    const uploadsDir = path.join(process.cwd(), 'uploads', 'prescriptions');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const medications = [
      { name: 'Amoxicillina', dosage: '500mg' },
      { name: 'Ibuprofene', dosage: '400mg' },
      { name: 'Paracetamolo', dosage: '1000mg' },
      { name: 'Aspirina', dosage: '100mg' },
      { name: 'Omeprazolo', dosage: '20mg' },
      { name: 'Metformina', dosage: '850mg' },
      { name: 'Atorvastatina', dosage: '20mg' },
      { name: 'Ramipril', dosage: '5mg' },
      { name: 'Levotiroxina', dosage: '50mcg' },
    ];

    const frequencies = [
      '1 volta al giorno',
      '2 volte al giorno',
      '3 volte al giorno',
      'Ogni 8 ore',
      'Ogni 12 ore',
      'Al bisogno',
      '1 compressa mattina e sera',
    ];

    for (const report of reports) {
      
      if (faker.datatype.boolean({ probability: 0.85 })) {
        const numPrescriptions = faker.number.int({ min: 1, max: 3 });

        for (let i = 0; i < numPrescriptions; i++) {
          const medication = faker.helpers.arrayElement(medications);
          const fileName = `prescription_${report.id}_${i + 1}_${Date.now()}.pdf`;
          const filePath = path.join(uploadsDir, fileName);

          // Genera PDF
          await this.generatePrescriptionPDF(filePath, report, medication.name);

          const startDate = faker.date.recent({ days: 7 });
          const endDate = faker.date.soon({
            days: faker.number.int({ min: 7, max: 60 }),
            refDate: startDate,
          });

          const prescription = this.prescriptionRepo.create({
            report,
            medicationName: medication.name,
            dosage: medication.dosage,
            frequency: faker.helpers.arrayElement(frequencies),
            filePath: `/uploads/prescriptions/${fileName}`,
            startDate,
            endDate,
          });

          prescriptions.push(prescription);
        }
      }
    }

    return this.prescriptionRepo.save(prescriptions);
  }

  private async generatePrescriptionPDF(
    filePath: string,
    report: MedicalReport,
    medicationName: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Header
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('PRESCRIZIONE MEDICA', { align: 'center' });
      doc.moveDown(0.5);

      doc
        .fontSize(10)
        .font('Helvetica')
        .text('CliniConnecta - Sistema di Gestione Sanitaria', {
          align: 'center',
        });
      doc.moveDown(2);

      // Box informazioni
      doc.fontSize(10).font('Helvetica-Bold').text('Informazioni Prescrizione');
      doc
        .fontSize(9)
        .font('Helvetica')
        .text(
          `Data emissione: ${new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
        );
      doc.text(`Report ID: #${report.id}`);
      doc.text(`Tipo visita: ${report.reportType}`);
      doc.moveDown(1.5);

      // Diagnosi
      doc.fontSize(11).font('Helvetica-Bold').text('DIAGNOSI:', { underline: true });
      doc.fontSize(9).font('Helvetica').text(report.diagnosis, {
        align: 'justify',
        lineGap: 2,
      });
      doc.moveDown(1.5);

      // Trattamento
      if (report.treatment) {
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('TRATTAMENTO PRESCRITTO:', { underline: true });
        doc.fontSize(9).font('Helvetica').text(report.treatment, {
          align: 'justify',
          lineGap: 2,
        });
        doc.moveDown(1.5);
      }

      // Farmaco
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('FARMACO:', { underline: true });
      doc.fontSize(10).font('Helvetica-Bold').text(medicationName);
      doc.moveDown(2);

      // Footer
      doc.moveDown(3);
      doc
        .fontSize(8)
        .font('Helvetica-Oblique')
        .text('Documento generato automaticamente dal sistema CliniConnecta', {
          align: 'center',
        });
      doc.text(`Generato il ${new Date().toLocaleString('it-IT')}`, {
        align: 'center',
      });

      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }
}
