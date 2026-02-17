import { Link } from "react-router-dom";
import SearchNav from "./SearchNav";
import { useAuth } from "@/context/AuthContext";

const Hero = () => {
  const { user } = useAuth();
  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Immagine di sfondo blurrata */}
      <div className="absolute inset-0 bg-cover bg-center myhero blur-xs brightness-75" />

      {/* Overlay opzionale per migliorare leggibilità */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Contenuto sopra (non blurrato) */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex w-full justify-center">
          <SearchNav/>
        </div>

        <div className="text-center mt-10">
          <h1 className="md:text-7xl text-5xl font-bold text-white">
            CliniConnecta
          </h1>
          <p className="py-6 md:text-4xl italic text-2xl text-white/90">
            Una piattaforma dove medici e pazienti si incontrano
          </p>
        </div>

        <div className="flex gap-6 pt-3">
          {!user && (
            <Link
              to={"/register"}
              className="btn btn-primary hover:bg-blue-600"
            >
              Registrati
            </Link>
          )}
          {!user && (
            <Link to={"/login"} className="btn btn-primary hover:bg-blue-600">
              Accedi
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
