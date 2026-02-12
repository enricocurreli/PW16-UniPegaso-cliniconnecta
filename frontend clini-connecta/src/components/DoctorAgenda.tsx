import type { Appointment } from "@/interfaces/appointment";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Prescriptions from "./Prescriptions";
import CreateMedicalReportForm from "./CreateMedicalReportForm";
import CreatePrescriptionModal from "./CreatePrescriptionModal";
import Button from "./Button";

const DoctorAgenda = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const status = searchParams.get("status") || "";

  const updateSearchParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  // Funzione per fetchare l'agenda (estratta per riutilizzarla)
  const fetchAgenda = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);
      if (status) params.set("status", status);

      const res = await fetch(
        `http://localhost:3000/appointments/doctor-appointments?` +
          params.toString(),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );
      const data: Appointment[] = await res.json();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgenda();
  }, [fromDate, toDate, status, token]);

  const handleOpenModal = (reportId: number) => {
    setSelectedReportId(reportId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReportId(null);
  };

  // Handler per il successo della creazione prescrizione
  const handlePrescriptionSuccess = () => {
    fetchAgenda(); // Ricarica tutti gli appuntamenti
  };

  return (
    <div className="px-6 space-y-10">
      <h1 className="text-2xl font-semibold">Agenda Dottore</h1>

      {/* FILTRI (URLSearchParams) */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Da data</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => updateSearchParam("fromDate", e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">A data</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => updateSearchParam("toDate", e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Stato</label>
          <select
            value={status}
            onChange={(e) => updateSearchParam("status", e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Tutti</option>
            <option value="CONFERMATO">Confermato</option>
            <option value="COMPLETATO">Completato</option>
            <option value="CANCELLATO">Cancellato</option>
          </select>
        </div>
      </div>

      {loading && <p>Caricamento agenda...</p>}

      {/* LISTA APPUNTAMENTI */}
      <div className="space-y-10">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="border rounded-lg p-4 shadow-sm flex flex-col gap-3 bg-base-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {appt.reason} — {appt.status}
                </p>
                <p className="text-sm ">
                  {appt.appointmentDate} alle {appt.appointmentTime} ·{" "}
                  {appt.durationMinutes} minuti
                </p>
              </div>
              <div className="text-right text-sm ">
                <p>{appt.clinic.name}</p>
                <p>
                  {appt.clinic.address}, {appt.clinic.city} (
                  {appt.clinic.postalCode})
                </p>
              </div>
            </div>

            {/* DATI PAZIENTE */}
            <div className="border-t pt-3 text-sm">
              <p className="font-medium">
                Paziente: {appt.patient.firstName} {appt.patient.lastName}
              </p>
              <p>
                Nato il {appt.patient.dateOfBirth} a {appt.patient.cityOfBirth}{" "}
                ({appt.patient.provinceOfBirth}) · CF: {appt.patient.fiscalCode}
              </p>
              <p>
                Indirizzo: {appt.patient.address} · Tel: {appt.patient.phone}
              </p>
            </div>

            {/* MEDICAL REPORT (ESISTENTE O DA CREARE) */}
            <div className="border-t pt-3 text-sm">
              {appt.medicalReport ? (
                <div>
                  <p className="font-medium">Referto esistente</p>
                  {/* mostra i dettagli del referto qui */}
                  <p>ID referto: {appt.medicalReport.id}</p>
                  {appt.medicalReport && (
                    <>
                      <div className="divider my-2" />
                      <p className="font-semibold">Referto:</p>
                      <p>{appt.medicalReport.title}</p>
                      <p>Diagnosi: {appt.medicalReport.diagnosis}</p>
                      <p>
                        Trattamento:{" "}
                        {appt.medicalReport.treatment ??
                          "Nessun trattamento indicato"}
                      </p>
                      <div className="divider my-2" />
                      {/* Prescrizioni solo se esiste un referto */}
                      <Prescriptions id={appt.medicalReport.id} />

                      {!appt.medicalReport ? (
                        <div className="border border-dashed rounded p-3 text-xs ">
                          <CreateMedicalReportForm appointmentId={appt.id} />
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="flex justify-center p-4">
                        {appt.medicalReport ? (
                          <Button
                            onClick={() =>
                              handleOpenModal(appt.medicalReport!.id)
                            }
                            classes="btn btn-primary"
                          >
                            Crea Prescrizione
                          </Button>
                        ) : (
                          " "
                        )}
                      </div>
                      {selectedReportId && (
                        <CreatePrescriptionModal
                          reportId={selectedReportId}
                          isOpen={isModalOpen}
                          onClose={handleCloseModal}
                          onSuccess={handlePrescriptionSuccess} // AGGIUNGI QUESTO
                        />
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-medium mb-2">
                    Nessun referto presente per questo appuntamento
                  </p>
                </div>
              )}
            </div>

            {/* NOTE APPUNTAMENTO */}
            {appt.notes && (
              <div className="border-t pt-3 text-sm">
                <p className="font-medium">Note</p>
                <p>{appt.notes}</p>
              </div>
            )}
          </div>
        ))}

        {!loading && appointments.length === 0 && (
          <p className="text-sm text-gray-500">
            Nessun appuntamento trovato con i filtri selezionati.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorAgenda;
