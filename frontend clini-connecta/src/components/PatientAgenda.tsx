import { useGet } from "@/hooks/useGet";
import type { Appointment } from "@/interfaces/appointment";
import Prescriptions from "./Prescriptions";

const PatientAgenda = () => {
  const { data, isLoading, error } = useGet<Appointment[]>(
    "/appointments/patient-appointments"
  );

  if (isLoading) {
    return <div className="min-h-screen p-4">Caricamento agenda...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 text-red-600">
        Errore nel caricamento dell'agenda.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen p-4">
        Nessuna visita trovata.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-4">
      <h1 className="text-3xl font-semibold mb-4">Le tue visite</h1>

      {data.map((appointment) => {
        const { doctor, clinic, medicalReport } = appointment;

        return (
          <div
            key={appointment.id}
            className="card bg-base-300 shadow"
          >
            <div className="card-body space-y-2">
              <h2 className="card-title">
                Visita del {appointment.appointmentDate} alle {appointment.appointmentTime}
              </h2>
              <p className="text-sm text-base-content/70">
                Stato: {appointment.status} • Durata: {appointment.durationMinutes} min
              </p>
              <p>
                <span className="font-semibold">Motivo:</span>{" "}
                {appointment.reason}
              </p>
              {appointment.notes && (
                <p>
                  <span className="font-semibold">Note:</span>{" "}
                  {appointment.notes}
                </p>
              )}

              <div className="divider my-2" />

              <p>
                <span className="font-semibold">Medico:</span>{" "}
                {doctor.firstName} {doctor.lastName}
              </p>
              <p>
                <span className="font-semibold">Struttura:</span>{" "}
                {clinic.name} – {clinic.address} {clinic.city}{" "}
                {clinic.postalCode}
              </p>

              {medicalReport && (
                <>
                  <div className="divider my-2" />
                  <p className="font-semibold">Referto:</p>
                  <p>{medicalReport.title}</p>
                  <p>Diagnosi: {medicalReport.diagnosis}</p>
                  <p>
                    Trattamento:{" "}
                    {medicalReport.treatment ?? "Nessun trattamento indicato"}
                  </p>

                  {/* Prescrizioni solo se esiste un referto */}
                  <Prescriptions id={medicalReport.id} />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PatientAgenda;
