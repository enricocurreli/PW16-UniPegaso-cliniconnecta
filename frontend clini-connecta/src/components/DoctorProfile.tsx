import { useGet } from "@/hooks/useGet";
import type { DoctorAvailabilityInterface } from "@/interfaces/availability";
import type { Clinic } from "@/interfaces/clinic";
import type { Doctor } from "@/interfaces/doctor";
import { Link } from "react-router-dom";
import DoctorAvailabilityForm from "./CreateAvailabilityForm";
import api from "@/api/axiosConfig";
import Button from "./Button";
import { useEffect, useState } from "react";

interface ClinicGroup {
  clinic: Clinic;
  slots: DoctorAvailabilityInterface[];
}

const DoctorProfile = () => {
  const {
    data: doctor,
    isLoading,
    error,
    refetch,
  } = useGet<Doctor>("/doctors/account");

  // Toast state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-hide toast dopo 3 secondi
  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="toast toast-center toast-middle">
        <div className="alert alert-error">
          <span>ERRORE</span>
        </div>
      </div>
    );

  if (!doctor) {
    return (
      <div className="toast toast-center toast-middle">
        <div className="alert alert-error">
          <span>ERRORE - PROFILO MEDICO NON TROVATO</span>
        </div>
      </div>
    );
  }

  const availabilitiesArray = Array.isArray(doctor.availabilities)
    ? doctor.availabilities
    : [];

  const availabilitiesByClinic = availabilitiesArray.reduce<
    Record<number, ClinicGroup>
  >((acc, avail) => {
    const clinicId = avail.clinic.id;
    if (!acc[clinicId]) {
      acc[clinicId] = {
        clinic: avail.clinic,
        slots: [],
      };
    }
    acc[clinicId].slots.push(avail);
    return acc;
  }, {});

  // Ordina i giorni della settimana
  const dayOrder: Record<string, number> = {
    Lunedì: 1,
    Martedì: 2,
    Mercoledì: 3,
    Giovedì: 4,
    Venerdì: 5,
    Sabato: 6,
    Domenica: 7,
  };

  const removeAvailability = async (id: number) => {
    try {
      const response = await api.delete(`/doctor-availability/${id}`);
  
      refetch();
      setSuccessMessage("Disponibilità eliminata con successo");
      return response.data;
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err?.response?.data?.message || "Errore durante l'eliminazione",
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
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

      {/* Header con info principali */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-start gap-6">
            <img
              src="/icons8-user-64.png"
              className="bg-amber-50 rounded-full w-24"
              alt="Avatar medico"
            />

            {/* Info personali */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                Dr. {doctor.firstName} {doctor.lastName}{" "}
              </h1>

              <div className="flex items-center gap-2 mt-2">
                <span className="badge badge-primary badge-lg">
                  {doctor.specialization.name}
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
                  <span>{doctor.user.email}</span>
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
                  <span>{doctor.phone}</span>
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
                    {doctor.licenseNumber}
                  </span>
                </div>
                <div className="flex">
                  <img
                    src="/public/icons8-gear-60.png"
                    className=" rounded-full w-5 bg-white"
                    alt="Avatar medico"
                  />
                  <span>
                    <Link
                      to="/complete-profile"
                      className="px-2 hover:underline hover:underline-offset-5 hover:text-red-600"
                    >
                      {" "}
                      Modifica{" "}
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {doctor.bio && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Biografia</h3>
              <p className="text-base-content/80 leading-relaxed">
                {doctor.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Disponibilità per clinica */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Disponibilità</h2>

        {Object.keys(availabilitiesByClinic).length > 0 ? (
          Object.values(availabilitiesByClinic).map((item) => {
            // Ordina gli slot per giorno
            const sortedSlots = [...item.slots].sort(
              (a, b) =>
                (dayOrder[a.dayOfWeek] || 0) - (dayOrder[b.dayOfWeek] || 0),
            );

            return (
              <div key={item.clinic.id} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  {/* Nome clinica */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="badge badge-outline badge-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {item.clinic.name}
                    </div>
                    <span className="text-sm text-base-content/70">
                      {item.clinic.address} - {item.clinic.city}
                    </span>

                  </div>

                  {/* Griglia orari */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sortedSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`border rounded-lg p-3 ${
                          slot.isActive
                            ? "border-primary bg-primary/5"
                            : "border-base-300 opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">
                            {slot.dayOfWeek}
                          </span>
                          {slot.isActive && (
                            <span className="badge badge-success badge-xs">
                              Attivo
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {slot.startTime.slice(0, 5)} -{" "}
                            {slot.endTime.slice(0, 5)}
                          </span>
                        </div>

                        <div className="text-base-content/60 mt-2">
                          <span>
                            {new Date(slot.validFrom).toLocaleDateString(
                              "it-IT",
                            )}{" "}
                            -{" "}
                            {new Date(slot.validTo).toLocaleDateString("it-IT")}
                          </span>
                        </div>
                        <div className="mt-2">
                          <Button
                            classes="btn btn-outline btn-error btn-sm"
                            onClick={() => removeAvailability(slot.id)}
                          >
                            Elimina
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
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
              />
            </svg>
            <span>Nessuna disponibilità configurata</span>
          </div>
        )}
        <DoctorAvailabilityForm />
      </div>

      {/* Stats rapide */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="stat-title">Disponibilità attive</div>
          <div className="stat-value text-primary">
            {doctor.availabilities.filter((a) => a.isActive).length}
          </div>
          <div className="stat-desc">
            Su {doctor.availabilities.length} totali
          </div>
        </div>

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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="stat-title">Cliniche</div>
          <div className="stat-value text-secondary">
            {Object.keys(availabilitiesByClinic).length}
          </div>
          <div className="stat-desc">Strutture convenzionate</div>
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
            {new Date(doctor.user.createdAt).toLocaleDateString("it-IT", {
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="stat-desc">
            {new Date(doctor.user.createdAt).toLocaleDateString("it-IT")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
