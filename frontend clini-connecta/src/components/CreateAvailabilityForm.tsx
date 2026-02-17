import { useActionState } from "react";
import Button from "./Button";
import { useGet } from "@/hooks/useGet";
import api from "@/api/axiosConfig";
import type { Clinic } from "@/interfaces/clinic";

interface CreateAvailabilityForm {
  error?: string;
  success?: boolean;
}

const DAYS_OF_WEEK = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica"
];

const DoctorAvailabilityForm = () => {
  const { data: clinics } = useGet<Clinic[]>(`/clinics`);

  const createAvailabilityAction = async (
    prevState: CreateAvailabilityForm,
    formData: FormData,
  ): Promise<CreateAvailabilityForm> => {
    const dayOfWeek = formData.get("dayOfWeek") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const validFrom = formData.get("validFrom") as string;
    const validTo = formData.get("validTo") as string;
    const clinic_id = formData.get("clinic_id") as string;

    if (!dayOfWeek || !startTime || !endTime || !validFrom || !validTo || !clinic_id) {
      return { 
        error: "Tutti i campi sono obbligatori", 
        success: false 
      };
    }

    try {
      await api.post("/doctor-availability/create", {
        dayOfWeek,
        startTime,
        endTime,
        validFrom,
        validTo,
        clinic_id: parseInt(clinic_id),
      });

      return { success: true };
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Errore durante la creazione della disponibilità";

      return { error: msg, success: false };
    }
  };

  const [state, formAction, isPending] = useActionState(
    createAvailabilityAction,
    {}
  );

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        Crea Nuova Disponibilità
      </div>
      <div className="collapse-content">
        <form action={formAction} className="space-y-4 pt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text px-1">Clinica *</span>
            </label>
            <select
              name="clinic_id"
              disabled={isPending}
              required
              className="select select-bordered w-full"
            >
              <option value="">Seleziona una clinica</option>
              {clinics?.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name} {clinic.address && `- ${clinic.address} - ${clinic.city}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text px-1">Giorno della settimana *</span>
            </label>
            <select
              name="dayOfWeek"
              disabled={isPending}
              required
              className="select select-bordered w-full"
            >
              <option value="">Seleziona un giorno</option>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text px-1">Ora inizio *</span>
              </label>
              <input
                type="time"
                name="startTime"
                disabled={isPending}
                required
                placeholder="08:30"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text px-1">Ora fine *</span>
              </label>
              <input
                type="time"
                name="endTime"
                disabled={isPending}
                required
                placeholder="12:30"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text px-1">Valido dal *</span>
              </label>
              <input
                type="date"
                name="validFrom"
                disabled={isPending}
                required
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text px-1">Valido fino al *</span>
              </label>
              <input
                type="date"
                name="validTo"
                disabled={isPending}
                required
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {state.error && (
            <div className="alert alert-error">
              <span>{state.error}</span>
            </div>
          )}

          {state.success && (
            <div className="alert alert-success">
              <span>Disponibilità creata con successo!</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            classes="px-4 py-2 rounded bg-primary hover:bg-blue-700"
          >
            {isPending ? "Creazione in corso..." : "Crea Disponibilità"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DoctorAvailabilityForm;
