#  CliniConnecta API

> Sistema di Gestione Sanitaria - Progetto di Laurea PW 16 
> **Autore:** Enrico Curreli  
> **Versione:** 0.0.1

##  Descrizione

CliniConnecta è un sistema completo di gestione sanitaria sviluppato con NestJS e TypeORM. Permette la gestione di appuntamenti medici, pazienti, medici, cliniche, report medici e prescrizioni con supporto per file PDF.

##  Caratteristiche Principali

-  Autenticazione JWT con Passport
-  Gestione medici e specializzazioni
-  Gestione pazienti e anagrafica completa
-  Gestione cliniche e disponibilità medici
-  Sistema di prenotazione appuntamenti
-  Report medici e diagnosi
-  Prescrizioni con generazione PDF
-  Documentazione API interattiva con Swagger
-  Database seeding con dati realistici per testing

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.x
- **Git**

##  Installazione

### 1. Clona il repository

```bash
git clone <url-repository>
cd clini-connecta_api
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura le variabili d'ambiente

Crea un file `.env` nella root del progetto:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=cliniconnecta

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development
```

### 4. Crea il database MySQL

```sql
CREATE DATABASE cliniconnecta;
```

### 5. Sincronizza lo schema del database

Avvia l'applicazione per creare automaticamente le tabelle:

```bash
npm run start:dev
```

TypeORM creerà tutte le tabelle necessarie. Ferma l'app con `Ctrl+C` dopo la sincronizzazione.

##  Popola il Database (Seeding)

Per testare l'applicazione con dati realistici:

```bash
npm run seed
```

**Dati generati:**
- 15 specializzazioni mediche
- 15 cliniche in città italiane
- 200 pazienti con dati completi
- 60 medici distribuiti tra specializzazioni
- ~150 relazioni medico-clinica (many-to-many)
- ~375 slot di disponibilità
- 400 appuntamenti (mix storici e futuri)
- ~120 report medici
- ~180 prescrizioni con PDF reali

**Credenziali di test:**
- Email: generate automaticamente da Faker
- Password: `Password123!`

##  Avvio dell'Applicazione

### Modalità sviluppo (con hot-reload)

```bash
npm run start:dev
```

L'app sarà disponibile su `http://localhost:3000`

### Modalità produzione

```bash
npm run build
npm run start:prod
```

### Debug mode

```bash
npm run start:debug
```

## 📚 Documentazione API

Documentazione Swagger interattiva disponibile su:

```
http://localhost:3000/api/docs
```

Potrai:
- ✅ Visualizzare tutti gli endpoint
- ✅ Testare le API direttamente
- ✅ Vedere schemi DTO ed entità
- ✅ Verificare autenticazione


## 📁 Struttura del Progetto

```
clini-connecta_api/
├── src/
│   ├── appointments/           # Gestione appuntamenti
│   ├── auth/                   # Autenticazione JWT
│   ├── clinics/                # Gestione cliniche
│   ├── doctors/                # Gestione medici
│   ├── doctor-availability/    # Disponibilità medici
│   ├── doctor-clinics/         # Tabella pivot many-to-many
│   ├── patients/               # Gestione pazienti
│   ├── medical-reports/        # Report medici
│   ├── prescriptions/          # Prescrizioni mediche
│   ├── specializations/        # Specializzazioni
│   ├── users/                  # Gestione utenti
│   ├── seed/                   # Database seeding
│   │   ├── seed.service.ts     # Logica di seeding
│   │   ├── seed.module.ts      # Modulo seeding
│   │   └── main.ts             # Entry point seeding
│   ├── enums/                  # Enumerazioni DB
│   │   └── db-enum.enum.ts     # Enum condivisi
│   └── main.ts                 # Entry point applicazione
├── uploads/
│   └── prescriptions/          # PDF prescrizioni generati
├── test/                       # Test E2E
├── .env                        # Variabili d'ambiente (non committare!)
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Comandi Disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm install` | Installa tutte le dipendenze |
| `npm run start` | Avvia l'applicazione |
| `npm run start:dev` | Avvia in modalità sviluppo con hot-reload |
| `npm run start:debug` | Avvia con debugger Node.js |
| `npm run start:prod` | Avvia versione produzione |
| `npm run build` | Compila il progetto TypeScript |
| `npm run seed` | Popola database con dati di test |
| `npm run seed:refresh` | Ri-esegui il seeding |
| `npm run test` | Esegui tutti i test |
| `npm run test:watch` | Test in modalità watch |
| `npm run test:cov` | Test con report coverage |
| `npm run test:e2e` | Test end-to-end |
| `npm run test:debug` | Debug dei test |
| `npm run lint` | Controlla e correggi errori ESLint |
| `npm run format` | Formatta codice con Prettier |

## 🗄️ Schema Database

### Entità Principali

- **Users**: Utenti del sistema (pazienti, medici, admin)
- **Patients**: Anagrafica pazienti
- **Doctors**: Anagrafica medici
- **Clinics**: Cliniche e strutture sanitarie
- **Specializations**: Specializzazioni mediche
- **DoctorClinic**: Tabella pivot medico-clinica (many-to-many)
- **DoctorAvailability**: Disponibilità oraria medici per clinica
- **Appointments**: Appuntamenti medici
- **MedicalReports**: Report e diagnosi
- **Prescriptions**: Prescrizioni con file PDF

### Relazioni

- User 1:1 Patient/Doctor
- Doctor N:M Clinic (tramite DoctorClinic)
- Doctor 1:N Appointment
- Patient 1:N Appointment
- Clinic 1:N Appointment
- Appointment 1:1 MedicalReport
- MedicalReport 1:N Prescription

##  Autenticazione

Il sistema utilizza JWT (JSON Web Tokens) per l'autenticazione:

1. Login con email e password
2. Ricezione token JWT
3. Inclusione token nell'header `Authorization: Bearer <token>`
4. Validazione automatica tramite Passport-JWT

##  Dipendenze Principali

### Produzione

- `@nestjs/core` - Framework NestJS
- `@nestjs/typeorm` - Integrazione TypeORM
- `typeorm` - ORM per database
- `mysql2` - Driver MySQL
- `bcrypt` - Hash password
- `@nestjs/jwt` - JWT authentication
- `@nestjs/passport` - Passport integration
- `@nestjs/swagger` - Documentazione API
- `pdfkit` - Generazione PDF
- `class-validator` - Validazione DTO
- `class-transformer` - Trasformazione oggetti

### Sviluppo

- `@faker-js/faker` - Generazione dati fake
- `typescript` - Supporto TypeScript
- `jest` - Framework testing
- `supertest` - Test HTTP

## 📝 Note Importanti

⚠️ **Sicurezza:**
- Mai committare il file `.env`
- Cambia `JWT_SECRET` in produzione
- Usa password sicure per MySQL

⚠️ **Database:**
- TypeORM sincronizza automaticamente lo schema in sviluppo
- Disabilita `synchronize: true` in produzione

⚠️ **File:**
- I PDF delle prescrizioni sono salvati in `uploads/prescriptions/`
- Assicurati che la directory abbia i permessi di scrittura

##  Troubleshooting

### Errore connessione database

- Verifica che MySQL sia in esecuzione  
- Controlla le credenziali nel `.env`  
- Assicurati che il database esista

### Errore durante il seeding

- Verifica che tutte le dipendenze siano installate  
- Controlla la connessione al database  
- Assicurati che il database sia accessibile

### Errore bcrypt su Windows

```bash
npm rebuild bcrypt --build-from-source
```

### Port già in uso

Cambia la porta nel file `.env`:
```env
PORT=3001
```

##  Licenza

UNLICENSED - Progetto privato di tesi

## Autore

**Enrico Curreli**  
Progetto di Laurea in Informatica  - Project Work 16
Università Pegaso

---

