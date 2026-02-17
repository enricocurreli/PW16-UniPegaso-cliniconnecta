import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useActionState } from "react";
import { useGet } from "@/hooks/useGet";
import api from "@/api/axiosConfig";

interface UpdateFormState {
  error?: string;
  success?: boolean;
}
interface Specializzation {
  id: number;
  name: string;
}

export function DoctorProfileForm() {
  const { data: doctorData } = useGet<{
    bio: string;
    licenseNumber: string;
    phone: string;
    specialization:{
      name:string
    }
    user:{

      email: string;
    }
  }>(`/doctors/account`);
  const navigate = useNavigate();
  const { data:specializations } = useGet<Specializzation[]>(`/specializations`);

  const updateAction = async (
    prevState: UpdateFormState,
    formData: FormData,
  ): Promise<UpdateFormState> => {
    const bio = formData.get("bio") as string;
    const licenseNumber = formData.get("licenseNumber") as string;
    const specialization = formData.get("specialization") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    try {
      const res = await api.patch(
        "http://localhost:3000/doctors/account/update",
        {
          bio,
          licenseNumber,
          phone,
          specialization,
          email,
        },
      );

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
  console.log(doctorData);
  
 return (
    <form action={formAction} className="space-y-4 min-h-screen">
      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Bio</span>
        </label>
        <textarea
          name="bio"
          disabled={isPending}
          defaultValue={doctorData?.bio || ""}
          placeholder="Bio..."
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Numero di iscrizione all'ALBO</span>
        </label>
        <input
          type="text"
          name="licenseNumber"
          disabled={isPending}
          defaultValue={doctorData?.licenseNumber || ""}
          placeholder="OMCeO07813"
          className="input input-bordered w-full"
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Email</span>
        </label>
        <input
          type="email"
          name="email"
          disabled={isPending}
          defaultValue={doctorData?.user.email || ""}
          placeholder="doctor@email.com"
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
          defaultValue={doctorData?.phone || ""}
          placeholder="+39 333 1234567"
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Specializzazione</span>
        </label>
        <select
          name="specialization"
          disabled={isPending}
          defaultValue={doctorData?.specialization.name || ""}
          className="select select-bordered w-full"
        >
          
          {specializations?.map((specialization) => (
            <option key={specialization.id} value={specialization.name}>
              {specialization.name}
            </option>
          ))}
        </select>
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