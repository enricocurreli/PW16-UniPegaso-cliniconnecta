import api from "@/api/axiosConfig";
import type { MedicalReport } from "@/interfaces/medicalReport";
import { useActionState } from "react";

interface CreateMedicalReportModalProps {
  appointmentId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormState {
  error?: string;
  success?: boolean;
  data?: MedicalReport;
}

const CreateMedicalReportModal = ({
  appointmentId,
  isOpen,
  onClose,
  onSuccess,
}: CreateMedicalReportModalProps) => {
  const initialState: FormState = {};
  const CreateMedicalReportAction = async (
    prevState: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    try {
      const reportType = formData.get("reportType") as string;
      const title = formData.get("title") as string;
      const diagnosis = formData.get("diagnosis") as string;
      const treatment = formData.get("treatment") as string;

      if (!reportType || !title || !diagnosis) {
        return {
          error: "Tutti i campi obbligatori devono essere compilati",
          success: false,
        };
      }
      const response = await api.post(
        `/medical-reports/create/${appointmentId}`,
       {
        reportType,
        title,
        diagnosis,
        treatment,
      }
      );

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 1500);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Errore sconosciuto",
        success: false,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    CreateMedicalReportAction,
    initialState,
  );

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Crea Referto</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={isPending}
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-base-content/70 mb-4">
          Appuntamento ID: {appointmentId}
        </p>

        {state.error && (
          <div className="alert alert-error mb-4">
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        {state.success && (
          <div className="alert alert-success mb-4">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Referto creato con successo! ID: {state.data?.id}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold mt-3">
                Tipo di visita
              </span>
            </label>
            <select
              name="reportType"
              className="select select-bordered w-full"
              required
              disabled={isPending}
            >
              <option value="" disabled>
                Scegli un motivo
              </option>
              <option>PRIMA VISITA</option>
              <option>VISITA DI CONTROLLO</option>
            </select>
          </div>

          {/* title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Titolo*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Es: Visita Cardiologica - Valutazione Iniziale"
              className="input input-bordered w-full"
              required
              disabled={isPending}
            />
          </div>

          {/* diagnosis */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Diagnosi *</span>
            </label>
            <textarea
              name="diagnosis"
              placeholder="Es: Paziente presenta parametri cardiovascolari nella norma..."
              className="textarea textarea-bordered w-full h-28"
              required
              disabled={isPending}
            />
            <div className="form-control mt-4.5">
              <label className="label">
                <span className="label-text">Trattamento</span>
              </label>
              <textarea
                name="treatment"
                className="textarea textarea-bordered w-full h-28"
                disabled={isPending}
                placeholder="Es: Nessuna terapia farmacologica necessaria al momento..."
              />
            </div>
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isPending}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creazione...
                </>
              ) : (
                "Crea Referto"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default CreateMedicalReportModal;
