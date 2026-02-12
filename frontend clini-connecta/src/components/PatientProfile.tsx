import { useGet } from "@/hooks/useGet";
import type { Patient } from "@/interfaces/patient";
import { Link } from "react-router-dom";


const PatientProfile = () => {
  const { data: patient, isLoading, error } = useGet<Patient>("/patients/account");
    if (isLoading) return <div>Loading...</div>;
    if (error)
      return (
        <div className="toast toast-center toast-middle">
          <div className="alert alert-error">
            <span>ERRORE</span>
          </div>
        </div>
      );
  
    if (!patient) {
      return (
        <div className="toast toast-center toast-middle">
          <div className="alert alert-error">
            <span>ERRORE - PROFILO PAZIENTE NON TROVATO</span>
          </div>
        </div>
      );
    }

  // Calcola età
  const birthDate = new Date(patient.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header con info principali */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start gap-6">
            <img
              src="/icons8-user-64.png"
              className="bg-amber-50 rounded-full w-24"
              alt="Avatar paziente"
            />

            {/* Info personali */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {patient.firstName} {patient.lastName}
              </h1>

              <div className="flex items-center gap-2 mt-2">
                {
                  patient.gender === 'M' ? <span className="badge badge-primary badge-lg">Maschio</span> : patient.gender === 'F' ? <span className="badge badge-accent badge-lg">Femmina</span> : <span className="badge badge-neutral badge-lg">Altro</span>
                }
                <span className="badge badge-outline badge-lg">
                  {age} anni
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{patient.user.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{patient.phone}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="font-mono text-xs">
                    {patient.fiscalCode}
                  </span>
                </div>

                <div className="flex">
                  <img
                    src="/public/icons8-gear-60.png"
                    className="rounded-full w-5 bg-white"
                    alt="Impostazioni"
                  />
                  <span>
                    <Link 
                      to="/complete-profile" 
                      className="px-2 hover:underline hover:underline-offset-5 hover:text-red-600"
                    >
                      Modifica
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dati Anagrafici */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold mb-4">Dati Anagrafici</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-base-content/70">Data di Nascita</p>
              <p className="font-semibold">
                {new Date(patient.dateOfBirth).toLocaleDateString("it-IT")}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content/70">Età</p>
              <p className="font-semibold">{age} anni</p>
            </div>

            <div>
              <p className="text-sm text-base-content/70">Luogo di Nascita</p>
              <p className="font-semibold">
                {patient.cityOfBirth} ({patient.provinceOfBirth})
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content/70">Sesso</p>
              <p className="font-semibold">
                {patient.gender === 'M' ? 'Maschio' : patient.gender === 'F' ? 'Femmina' : 'Altro'}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-base-content/70">Indirizzo</p>
              <p className="font-semibold">{patient.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats rapide */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="stat-title">Età</div>
          <div className="stat-value text-secondary">{age}</div>
          <div className="stat-desc">anni</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="stat-title">Codice Fiscale</div>
          <div className="stat-value text-primary text-xl font-mono">
            {patient.fiscalCode}
          </div>
          <div className="stat-desc">Identificativo</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="stat-title">Membro dal</div>
          <div className="stat-value text-accent text-2xl">
            {new Date(patient.user.createdAt).toLocaleDateString("it-IT", {
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="stat-desc">
            {new Date(patient.user.createdAt).toLocaleDateString("it-IT")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile