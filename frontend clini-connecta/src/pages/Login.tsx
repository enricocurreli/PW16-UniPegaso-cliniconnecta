import Button from "@/components/Button";
import { useActionState } from "react";
import { useAuth } from "@/context/AuthContext"; 
import { useNavigate } from 'react-router-dom';

interface LoginFormState {
  error?: string;
  success?: boolean;
}

function Login() {
  const { login, token, user } = useAuth();
  const navigate = useNavigate();
    
  const loginAction = async (
    prevState: LoginFormState,
    formData: FormData
  ): Promise<LoginFormState> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      navigate('/');
      return { success: true };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Errore durante il login',
        success: false 
      };
    }
  };

  const [state, formAction, isPending] = useActionState(loginAction, {});


  return (
    <div className="flex min-h-screen">
      {/* Form Section */}
      <div className="flex-1 flex justify-center p-8 bg-base-100">
        <div className="w-full max-w-md bg-base-300 rounded-2xl p-10 md:mt-20 h-96">
          <h1 className="md:text-5xl text-3xl font-bold mb-6">Login</h1>
          <form action={formAction} className="space-y-3">
           
              <label className="label">
                <span className="label-text px-1">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@esempio.com"
                className="input input-bordered w-full"
                required
              />
           

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
              />
            </div>

            {state.error && (
              <div className="alert alert-error">
                <span>{state.error}</span>
              </div>
            )}

            {state.success && (
              <div className="alert alert-success">
                <span>Login effettuato!</span>
              </div>
            )}

            <Button
              type="submit"
              classes="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? "Caricamento..." : "Accedi"}
            </Button>
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
              Benvenuto su CliniConnecta
            </h2>
            <p className="text-xl">
              Prenota visite mediche in modo semplice e veloce
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
