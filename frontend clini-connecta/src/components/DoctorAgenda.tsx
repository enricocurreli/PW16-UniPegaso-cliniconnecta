import type { Appointment } from "@/interfaces/appointment";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useGet } from "@/hooks/useGet";
import Prescriptions from "./Prescriptions";
import CreatePrescriptionModal from "./CreatePrescriptionModal";
import Button from "./Button";
import MedicalReportModal from "./CreateMedicalReportModal";

const DoctorAgenda = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenReport, setIsModalOpenReport] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedMedicalReport, setSelectedMedicalReport] = useState<
    number | null
  >(null);

  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const status = searchParams.get("status") || "";

  const params: Record<string, string> = {};
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;
  if (status) params.status = status;

  const {
    data: appointments = [],
    isLoading: loading,
    refetch,
  } = useGet<Appointment[]>("/appointments/doctor-appointments", { params });

  const updateSearchParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleOpenModal = (reportId: number) => {
    setSelectedReportId(reportId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedicalReport(null);
  };

  const handleOpenModalMedicalReport = (apptId: number) => {
    setSelectedMedicalReport(apptId);
    setIsModalOpenReport(true);
  };

  const handleCloseModalMedicalReport = () => {
    setIsModalOpenReport(false);
    setSelectedMedicalReport(null);
  };

  const handlePrescriptionSuccess = () => {
    refetch();
  };

  return (
    <div className="px-6 space-y-10 min-h-screen">
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
                <p className="text-sm">
                  {new Date(appt.appointmentDate).toLocaleDateString("it-IT")} alle{" "}
                  {appt.appointmentTime} · {appt.durationMinutes} minuti
                </p>
              </div>
              <div className="text-right text-sm">
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
                  <p>ID referto: {appt.medicalReport.id}</p>

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

                  {/* Prescrizioni */}
                  <Prescriptions id={appt.medicalReport.id} />

                  {/* Bottone Crea Prescrizione */}

                  <div className="flex justify-center p-4">
                    <Button
                      onClick={() => handleOpenModal(appt.medicalReport!.id)}
                      classes="btn btn-primary"
                    >
                      Crea Prescrizione
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-medium mb-2">
                    Nessun referto presente per questo appuntamento
                  </p>

                  {/* Bottone Crea Referto */}
                  {appt.status != "CANCELLATO" && (
                    <div className="flex justify-center p-4">
                      <Button
                        onClick={() => handleOpenModalMedicalReport(appt.id)}
                        classes="btn btn-primary"
                      >
                        Crea Referto
                      </Button>
                    </div>
                  )}
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

      {/* MODALS */}
      {selectedReportId && (
        <CreatePrescriptionModal
          reportId={selectedReportId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handlePrescriptionSuccess}
        />
      )}

      {selectedMedicalReport && (
        <MedicalReportModal
          appointmentId={selectedMedicalReport}
          isOpen={isModalOpenReport}
          onClose={handleCloseModalMedicalReport}
          onSuccess={handlePrescriptionSuccess}
        />
      )}
    </div>
  );
};

export default DoctorAgenda;
