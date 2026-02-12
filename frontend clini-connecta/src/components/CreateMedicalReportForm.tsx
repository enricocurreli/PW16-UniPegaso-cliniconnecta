import { useAuth } from "@/context/AuthContext";
import type { MedicalReport } from "@/interfaces/medicalReport";
import { useActionState } from "react";
import Button from "./Button";

interface ReportProps {
  appointmentId: number;
}
interface FormState {
  error?: string;
  success?: boolean;
  data?: MedicalReport;
}

const CreateMedicalReportForm = ({ 
  appointmentId 
}: ReportProps) => {
    const { token } = useAuth();
  const initialState: FormState = {};
  
  // Crea la funzione action inline per catturare appointmentId dalla closure
  const createAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    try {
      const reportType = formData.get('reportType') as string;
      const title = formData.get('title') as string;
      const diagnosis = formData.get('diagnosis') as string;
      const treatment = formData.get('treatment') as string || null;

      if (!reportType || !title || !diagnosis) {
        return {
          error: 'Tutti i campi obbligatori devono essere compilati',
          success: false,
        };
      }

      const response = await fetch(
        `http://localhost:3000/medical-report/create/${appointmentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            reportType,
            title,
            diagnosis,
            treatment,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante la creazione del report');
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        success: false,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(createAction, initialState);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Crea Medical Report</h2>
        <p className="text-sm text-base-content/70">
          Appuntamento ID: {appointmentId}
        </p>
        
        {state.error && (
          <div className="alert alert-error">
            <span>{state.error}</span>
          </div>
        )}

        {state.success && (
          <div className="alert alert-success">
            <span>Report creato con successo! ID: {state.data?.id}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tipo di Report *</span>
            </label>
            <select 
              name="reportType" 
              className="select select-bordered w-full"
              required
              disabled={isPending}
            >
              <option value="">Seleziona tipo</option>
              <option value="PRIMA VISITA">Prima Visita</option>
              <option value="VISITA DI CONTROLLO">Visita di Controllo</option>

            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Titolo *</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Es: Visita cardiologica di controllo"
              className="input input-bordered w-full"
              required
              disabled={isPending}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Diagnosi *</span>
            </label>
            <textarea
              name="diagnosis"
              placeholder="Inserisci la diagnosi..."
              className="textarea textarea-bordered h-24"
              required
              disabled={isPending}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Trattamento (opzionale)</span>
            </label>
            <textarea
              name="treatment"
              placeholder="Inserisci il trattamento prescritto..."
              className="textarea textarea-bordered h-24"
              disabled={isPending}
            />
          </div>

          <div className="form-control mt-6">
            <Button 
              type="submit" 
              classes="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creazione in corso...
                </>
              ) : (
                'Crea Report'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMedicalReportForm;
