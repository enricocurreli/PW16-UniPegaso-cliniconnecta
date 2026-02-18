import { useGet } from "@/hooks/useGet";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { Slot } from "@/interfaces/slot";
import type { DoctorClinic } from "@/interfaces/clinic";
import axios from "axios";
import api from "@/api/axiosConfig";

const DoctorAvailability = () => {
  const { doctorId } = useParams();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedClinic, setSelectedClinic] = useState<number | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [reason, setReason] = useState<string>();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  
  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  //  Cliniche dove lavora il dottore
  const {
    data: doctorClinics,
    isLoading: loadingClinics,
    error: errorClinics,
  } = useGet<DoctorClinic[]>(`/doctor-clinics/clinic/${doctorId}`);

  // Estrai solo le cliniche
  const clinics = useMemo(
    () => doctorClinics?.map((dc) => dc.clinic) || [],
    [doctorClinics],
  );

  // Carico gli slot disponibili (solo quando clinica + data sono selezionati)
  const {
    data: slotsData,
    isLoading: loadingSlots,
    error: errorSlots,
  } = useGet<Slot>(`/appointments/available-slots`, {
    params: {
      doctorId: doctorId,
      clinicId: selectedClinic,
      date: selectedDate,
    },
    enabled: !!doctorId && !!selectedClinic && !!selectedDate,
  });

  const createAppointment = async (appointmentData: object) => {
    try {
      const response = await api.post(
        "/appointments/create",
        appointmentData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleBooking = async (slot: { time: string; endTime: string }) => {
    const confirmed = window.confirm(
      `Confermi la prenotazione?\n\n` +
        `Data: ${new Date(selectedDate).toLocaleDateString("it-IT")}\n` +
        `Orario: ${slot.time} - ${slot.endTime}\n` +
        `Clinica: ${clinics?.find((c) => c.id === selectedClinic)?.name}`,
    );

    if (!confirmed) return;

    let doctor_ID = 0;
    if (doctorId) {
      doctor_ID = parseInt(doctorId);
    }

    const appointmentData = {
      doctorId: doctor_ID,
      clinicId: selectedClinic,
      appointmentDate: selectedDate,
      appointmentTime: slot.time,
      notes: notes || "",
      reason: reason || "",
    };

    try {
      const result = await createAppointment(appointmentData);
      console.log("Risultato:", result);

      setSuccessMessage("Appuntamento prenotato con successo!");

      
      navigate("/my-appointments", {
        state: {
          appointment: result,
          message: "Prenotazione completata con successo!",
        },
      });
    } catch (error) {
      console.error("Errore completo:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        const msg =
          error.response?.data?.message || "Errore nella prenotazione";
        setErrorMessage(msg);
      } else {
        setErrorMessage("Errore nella prenotazione. Riprova.");
      }
    }
  };

  // Loading iniziale
  if (loadingClinics) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Errore caricamento cliniche
  if (errorClinics) {
    return (
      <div className="alert alert-error m-4">
        <span>Errore nel caricamento delle cliniche</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-10">
      {/* Toast DaisyUI */}
      <div className="toast toast-top toast-end z-50">
        {successMessage && (
          <div className="alert alert-success shadow-lg">
            <span>{successMessage}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setSuccessMessage(null)}
            >
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error shadow-lg">
            <span>{errorMessage}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setErrorMessage(null)}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Prenota Appuntamento</h1>
        <p className="mb-8">
          Seleziona la clinica e la data per vedere gli orari disponibili
        </p>

        {/* Selezione Clinica */}
        <div className="mb-6">
          <label className="label">
            <span className="label-text font-semibold">Clinica</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedClinic || ""}
            onChange={(e) => setSelectedClinic(Number(e.target.value))}
          >
            <option value="" disabled>
              Scegli una clinica
            </option>
            {clinics?.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name} - {clinic.city}
              </option>
            ))}
          </select>
          <label className="label">
            <span className="label-text font-semibold mt-3">
              Tipo di visita
            </span>
          </label>
          <select
            className="select select-bordered w-full"
            value={reason || ""}
            onChange={(e) => setReason(e.target.value)}
            disabled={!selectedClinic}
          >
            <option value="" disabled>
              Scegli un motivo
            </option>
            <option>PRIMA VISITA</option>
            <option>VISITA DI CONTROLLO</option>
          </select>
          <label className="label">
            <span className="label-text font-semibold mt-3">Note</span>
          </label>
          <input
            type="text"
            className="input w-full"
            value={notes || ""}
            onChange={(e) => setNotes(e.target.value)}
            disabled={!selectedClinic}
          />
        </div>

        {/* Selezione Data */}
        <div className="mb-8">
          <label className="label">
            <span className="label-text font-semibold">Data</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            disabled={!selectedClinic}
          />
        </div>

        {/* Messaggio informativo prima della selezione */}
        {!selectedClinic && (
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Seleziona una clinica per vedere gli orari disponibili</span>
          </div>
        )}

        {/* Loading slot */}
        {loadingSlots && (
          <div className="alert alert-warning">
            <span className="loading loading-spinner"></span>
            <span>Caricamento orari disponibili...</span>
          </div>
        )}

        {/* Errore caricamento slot */}
        {errorSlots && (
          <div className="alert alert-error mb-3">
            <span>Errore nel caricamento degli orari</span>
          </div>
        )}

        {/* Lista Slot Disponibili */}
        {slotsData && slotsData.slots && slotsData.slots.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl">Orari Disponibili</h3>
              <div className="badge badge-success">
                {slotsData.slots.length} slot
              </div>
            </div>

            <div className="space-y-2">
              {slotsData.slots.map((slot, index) => (
                <button
                  key={index}
                  className="btn btn-outline btn-lg w-full justify-between hover:btn-primary"
                  onClick={() => handleBooking(slot)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🕐</span>
                    <span className="font-semibold text-lg">
                      {slot.time} - {slot.endTime}
                    </span>
                  </div>
                  <span className="text-sm opacity-70">
                    Clicca per prenotare →
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          selectedClinic &&
          !loadingSlots && (
            <div className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>
                Nessun orario disponibile per il{" "}
                {new Date(selectedDate).toLocaleDateString("it-IT")}
              </span>
            </div>
          )
        )}

        {/* Info Clinica Selezionata */}
        {selectedClinic && clinics && (
          <div className="mt-8 p-4 bg-base-200 rounded-lg">
            <h4 className="font-semibold mb-2">Clinica Selezionata:</h4>
            {clinics
              .filter((c) => c.id === selectedClinic)
              .map((clinic) => (
                <div key={clinic.id}>
                  <p className="font-bold">{clinic.name}</p>
                  <p className="text-sm">
                    {clinic.address} - {clinic.postalCode} {clinic.city}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAvailability;
