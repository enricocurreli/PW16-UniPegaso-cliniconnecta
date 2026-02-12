import { useActionState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'; 
interface RegisterFormState {
  error?: string;
  success?: boolean;
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const registerAction = async (
    prevState: RegisterFormState,
    formData: FormData
  ): Promise<RegisterFormState> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    
    try {
      await register({
        email,
        password,
        role,
        firstName,
        lastName
      });
      
      navigate('/complete-profile');
      return { success: true };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Errore durante la registrazione',
        success: false 
      };
    }
  };

  
  
  const [state, formAction, isPending] = useActionState(registerAction, {});

  return (
    <div className="flex min-h-screen">
      {/* Form Section */}
      <div className="flex-1 flex justify-center p-8 bg-base-100">
        <div className="w-full max-w-md bg-base-300 rounded-2xl p-10 md:mt-10 h-3/4">
          <h1 className="md:text-5xl text-3xl font-bold mb-6">Registrati</h1>
          <form action={formAction} className="space-y-3">
            
            <div className="form-control">
              <label className="label">
                <span className="label-text px-1">Nome</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Mario"
                className="input input-bordered w-full"
                required
                disabled={isPending}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text px-1">Cognome</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Rossi"
                className="input input-bordered w-full"
                required
                disabled={isPending}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text px-1">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@esempio.com"
                className="input input-bordered w-full"
                required
                disabled={isPending}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
                disabled={isPending}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Ruolo</span>
              </label>
              <select 
                name="role" 
                className="select select-bordered w-full"
                defaultValue="PAZIENTE"
                disabled={isPending}
              >
                <option value="PAZIENTE">Paziente</option>
                <option value="DOTTORE">Dottore</option>
              </select>
            </div>

            {state.error && (
              <div className="alert alert-error">
                <span>{state.error}</span>
              </div>
            )}

            {state.success && (
              <div className="alert alert-success">
                <span>Registrazione completata!</span>
              </div>
            )}

            <Button
              type="submit"
              classes="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? "Caricamento..." : "Registrati"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm">
                Hai già un account?{' '}
                <a href="/login" className="link link-primary">
                  Accedi
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:flex lg:flex-1 bg-primary relative">
        <img
          src="/public/alexandr-podvalny-tE7_jvK-_YU-unsplash.jpg"
          alt="Healthcare"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-primary/70 flex items-center justify-center p-12">
          <div className="text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Unisciti a CliniConnecta
            </h2>
            <p className="text-xl">
              Crea il tuo account e inizia a gestire le tue visite mediche
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;