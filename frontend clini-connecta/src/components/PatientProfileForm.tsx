import { useAuth } from "@/context/AuthContext";
import { useActionState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

interface UpdateFormState {
  error?: string;
  success?: boolean;
}

export function PatientProfileForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  console.log(token);
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
      const res = await fetch("http://localhost:3000/patients/account/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gender,
          dateOfBirth,
          cityOfBirth,
          provinceOfBirth,
          phone,
          address,
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

  return (
    <form action={formAction} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text px-1">Genere</span>
        </label>
        <select
          name="gender"
          disabled={isPending}
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
        classes="px-4 py-2 rounded bg-primary  hover:bg-blue-700"
      >
        {isPending ? "Caricamento..." : "Salva"}
      </Button>
    </form>
  );
}
