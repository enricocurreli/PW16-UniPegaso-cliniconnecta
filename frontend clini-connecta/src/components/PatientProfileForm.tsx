import { useActionState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig";
import { useGet } from "@/hooks/useGet";

interface UpdateFormState {
  error?: string;
  success?: boolean;
}

interface PatientData {
  gender: string;
  dateOfBirth: string;
  cityOfBirth: string;
  provinceOfBirth: string;
  phone: string;
  address: string;
}

export function PatientProfileForm() {
  const navigate = useNavigate();
  
  // Carica i dati attuali del paziente
  const { data: patientData } = useGet<PatientData>(`/patients/account`);
  
  const updateAction = async (
    prevState: UpdateFormState,
    formData: FormData,
  ): Promise<UpdateFormState> => {
    const gender = formData.get("gender") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const cityOfBirth = formData.get("cityOfBirth") as string;
    const provinceOfBirth = formData.get("provinceOfBirth") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    
    try {
      await api.patch("/patients/account/update", {
        gender,
        dateOfBirth,
        cityOfBirth,
        provinceOfBirth,
        phone,
        address,
      });

      navigate("/");
      return { success: true };
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Errore durante la modifica dei dati";

      return { error: msg, success: false };
    }
  };
  
  const [state, formAction, isPending] = useActionState(updateAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Genere</span>
        </label>
        <select
          name="gender"
          disabled={isPending}
          defaultValue={patientData?.gender || ""}
          className="select select-bordered w-full"
        >
          <option value="">-</option>
          <option value="M">MASCHIO</option>
          <option value="F">FEMMINA</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Data di nascita</span>
        </label>
        <input
          type="date"
          name="dateOfBirth"
          disabled={isPending}
          defaultValue={patientData?.dateOfBirth ? new Date(patientData.dateOfBirth).toISOString().split('T')[0] : ""}
          placeholder="YYYY-MM-DD"
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Città di nascita</span>
        </label>
        <input
          type="text"
          name="cityOfBirth"
          disabled={isPending}
          defaultValue={patientData?.cityOfBirth || ""}
          placeholder="Città di nascita"
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Provincia di nascita</span>
        </label>
        <input
          type="text"
          name="provinceOfBirth"
          disabled={isPending}
          defaultValue={patientData?.provinceOfBirth || ""}
          placeholder="Provincia di nascita"
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Telefono</span>
        </label>
        <input
          type="tel"
          name="phone"
          disabled={isPending}
          defaultValue={patientData?.phone || ""}
          placeholder="+39 333 1234567"
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Indirizzo</span>
        </label>
        <input
          type="text"
          name="address"
          disabled={isPending}
          defaultValue={patientData?.address || ""}
          placeholder="Via Roma 1, Milano"
          className="input input-bordered w-full"
        />
      </div>
      
      {state.error && (
        <div className="alert alert-error">
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="alert alert-success">
          <span>Modifica completata!</span>
        </div>
      )}
      
      <Button
        type="submit"
        classes="px-4 py-2 rounded bg-primary hover:bg-blue-700"
      >
        {isPending ? "Caricamento..." : "Salva"}
      </Button>
    </form>
  );
}
