import { useGet } from "@/hooks/useGet";
import type { Appointment } from "@/interfaces/appointment";
import Prescriptions from "./Prescriptions";
import Button from "./Button";
import api from "@/api/axiosConfig";

const PatientAgenda = () => {
  const { data, isLoading, error, refetch } = useGet<Appointment[]>(
    "/appointments/patient-appointments",
  );
  const removeAppointment = async (id: number) => {
    try {
      const response = await api.delete(
        `http://localhost:3000/appointments/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

const handleRemove = async (id: number) => {
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare questo appuntamento?"
    );
    
    if (!confirmed) return;

    try {
      await removeAppointment(id);
      alert("Appuntamento eliminato con successo!");
      
      if (refetch) {
        await refetch();
      }
    } catch (error) {
      alert("Errore durante l'eliminazione. Riprova.");
      console.error(error);
    }
  };

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
    return <div className="min-h-screen p-4">Nessuna visita trovata.</div>;
  }

  return (
    <div className="min-h-screen p-4 space-y-4">
      <h1 className="text-3xl font-semibold mb-4">Le tue visite</h1>

      {data.map((appointment) => {
        const { doctor, clinic, medicalReport } = appointment;

        return (
          <div key={appointment.id} className="card bg-base-300 shadow ">
            <div className="card-body space-y-2">
              <div className=" flex justify-between">
                <h2 className="card-title">
                  
                  Visita del {new Date(appointment.appointmentDate).toLocaleDateString("it-IT")} alle{" "}
                  {appointment.appointmentTime}
                </h2>
                {appointment.status === "CONFERMATO" && (
                  <Button onClick={()=>handleRemove(appointment.id)} classes="btn btn btn-outline btn-error w-1/8 ">Elimina</Button>
                )}
              </div>

              <p className="text-sm text-base-content/70">
                Stato: {appointment.status} • Durata:{" "}
                {appointment.durationMinutes} min
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
                <span className="font-semibold">Struttura:</span> {clinic.name}{" "}
                – {clinic.address} {clinic.city} {clinic.postalCode}
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
