import api from "@/api/axiosConfig";
import type { Prescription } from "@/interfaces/prescriptions";
import { useActionState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface CreatePrescriptionModalProps {
  reportId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormState {
  error?: string;
  success?: boolean;
  data?: Prescription;
}

const CreatePrescriptionModal = ({
  reportId,
  isOpen,
  onClose,
  onSuccess,
}: CreatePrescriptionModalProps) => {
  const initialState: FormState = {};
  const queryClient = useQueryClient();
  const createPrescriptionAction = async (
    prevState: FormState,
    formData: FormData,
  ): Promise<FormState> => {
    try {
      const medicationName = formData.get("medicationName") as string;
      const dosage = formData.get("dosage") as string;
      const frequency = formData.get("frequency") as string;
      const startDate = formData.get("startDate") as string;
      const endDate = formData.get("endDate") as string;
      const file = formData.get("file") as File;

      if (!medicationName || !dosage || !frequency || !startDate || !endDate) {
        return {
          error: "Tutti i campi obbligatori devono essere compilati",
          success: false,
        };
      }

      const uploadFormData = new FormData();
      uploadFormData.append("medicationName", medicationName);
      uploadFormData.append("dosage", dosage);
      uploadFormData.append("frequency", frequency);
      uploadFormData.append("startDate", startDate);
      uploadFormData.append("endDate", endDate);

      if (file && file.size > 0) {
        uploadFormData.append("file", file);
      }

      const response = await api.post(
        `/prescriptions/upload/${reportId}`,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      await queryClient.refetchQueries({
        queryKey: [`/prescriptions/${response.data.id}`],
        exact: false,
      });


      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 2000);

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
    createPrescriptionAction,
    initialState,
  );

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Crea Prescrizione</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={isPending}
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-base-content/70 mb-4">
          Referto ID: {reportId}
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
            <span>Prescrizione creata con successo! ID: {state.data?.id}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* Medication Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nome Farmaco *</span>
            </label>
            <input
              type="text"
              name="medicationName"
              placeholder="Es: Amoxicillina"
              className="input input-bordered w-full"
              required
              disabled={isPending}
            />
          </div>

          {/* Dosage */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Dosaggio *</span>
            </label>
            <input
              type="text"
              name="dosage"
              placeholder="Es: 500mg"
              className="input input-bordered w-full"
              required
              disabled={isPending}
            />
          </div>

          {/* Frequency */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Frequenza *</span>
            </label>
            <input
              type="text"
              name="frequency"
              placeholder="Es: 3 volte al giorno"
              className="input input-bordered w-full"
              required
              disabled={isPending}
            />
          </div>

          {/* Date Range - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Data Inizio *</span>
              </label>
              <input
                type="date"
                name="startDate"
                className="input input-bordered w-full"
                required
                disabled={isPending}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Data Fine *</span>
              </label>
              <input
                type="date"
                name="endDate"
                className="input input-bordered w-full"
                required
                disabled={isPending}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Certificato PDF (opzionale)</span>
            </label>
            <input
              type="file"
              name="file"
              accept=".pdf"
              className="file-input file-input-bordered w-full"
              disabled={isPending}
            />
            <label className="label">
              <span className="label-text-alt">Formato supportato: PDF</span>
            </label>
          </div>

          {/* Modal Actions */}
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
                "Crea Prescrizione"
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

export default CreatePrescriptionModal;
