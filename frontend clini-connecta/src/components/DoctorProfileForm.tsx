import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useActionState } from "react";
import { useGet } from "@/hooks/useGet";

interface UpdateFormState {
  error?: string;
  success?: boolean;
}
interface Specializzation {
  id: number;
  name: string;
}

export function DoctorProfileForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
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
      const res = await fetch("http://localhost:3000/doctors/account/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio,
          licenseNumber,
          phone,
          specialization,
          email,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.message || data?.error || "Errore durante la modifica dei dati";

        return { error: msg, success: false };
      }

      navigate("/");
      return { success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Errore durante la modifica dei dati",
        success: false,
      };
    }
  };
  const [state, formAction, isPending] = useActionState(updateAction, {});
  const { data } = useGet<Specializzation[]>(`/specializations`);
  return (
    <form action={formAction} className="space-y-4 min-h-screen">
      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Bio</span>
        </label>
        <textarea
          name="bio"
          disabled={isPending}
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
          className="select select-bordered w-full"
        >
          <option value="">-</option>
          {data &&
            data.map((specialization) => {
              return (
                <option key={specialization.id} value={specialization.name}>
                  {specialization.name}
                </option>
              );
            })}
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
        classes="px-4 py-2 rounded bg-primary  hover:bg-blue-700"
      >
        {isPending ? "Caricamento..." : "Salva"}
      </Button>
      
    </form>
  );
}
