import { useState, useEffect, useRef, useMemo } from "react";
import Button from "./Button";
import { useGet } from "@/hooks/useGet";
import { useNavigate } from "react-router-dom";
import type { Clinic } from "@/interfaces/clinic";


interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string | null;
  email: string | null;
  phone: string;
  licenseNumber: string;
}

interface SearchResult {
  type: 'clinic' | 'doctor';
  id: number;
  name: string;
  description: string;
  data: any;
}

const SearchNav = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce del termine di ricerca
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);


  const {
    data: clinicsData,
    isLoading: loadingClinics,
  } = useGet<Clinic[]>("/clinics/search-clinics", {
    params: { search: debouncedSearch },
    enabled: debouncedSearch.length >= 3,
  });

 
  const {
    data: doctorsData,
    isLoading: loadingDoctors,
  } = useGet<Doctor[]>("/doctors/search", {
    params: { search: debouncedSearch },
    enabled: debouncedSearch.length >= 3,
  });

  const loading = loadingClinics || loadingDoctors;

  
  const results = useMemo(() => {
    if (debouncedSearch.length < 3) return [];

    const clinicResults: SearchResult[] = (clinicsData || []).map((clinic) => ({
      type: "clinic" as const,
      id: clinic.id,
      name: clinic.name,
      description: [clinic.address, clinic.city].filter(Boolean).join(', '),
      data: clinic,
    }));

    const doctorResults: SearchResult[] = (doctorsData || []).map((doctor) => ({
      type: "doctor" as const,
      id: doctor.id,
      name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      description: doctor.specialization || doctor.email || 'Medico',
      data: doctor,
    }));

    return [...clinicResults, ...doctorResults];
  }, [clinicsData, doctorsData, debouncedSearch]);

  
  useEffect(() => {
    if (debouncedSearch.length >= 3) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [debouncedSearch]);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "clinic") {
      navigate(`/clinic/${result.id}`);
    } else if (result.type === "doctor") {
      navigate(`/doctor-availability/${result.id}`);
    }
    setSearchTerm("");
    setDebouncedSearch("");
    setShowResults(false);
  };


  return (
    <div className="relative w-full flex justify-center" ref={searchRef}>
      {/* Barra di ricerca */}
      <div className="border-4 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all flex md:w-1/2 w-3/4 md:h-16 h-12">
        <input
          type="text"
          placeholder="Cerca cliniche, medici, città, specializzazioni..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => debouncedSearch.length >= 3 && setShowResults(true)}
          className="input input-bordered flex-1 border-0 shadow-none h-full rounded-l-lg rounded-r-none text-sm md:text-base px-4"
        />
        
        <Button
          onClick={() => setDebouncedSearch(searchTerm)}
          classes="btn bg-primary text-white flex items-center justify-center font-medium hover:bg-blue-600 cursor-pointer transition w-12 md:w-16 h-full p-2 rounded-r-lg rounded-l-none border-0"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </Button>
      </div>

      {/* Dropdown risultati - posizionato più in basso */}
      {showResults && debouncedSearch.length >= 3 && (
        <div className="absolute z-50  md:mt-17 bg-base-100 shadow-2xl rounded-lg max-h-125 overflow-y-auto border-2 border-base-300 md:w-1/2 w-3/4">
          {loading && (
            <div className="p-6 text-center">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-3 text-sm text-base-content/70">Ricerca in corso...</p>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-8 text-center text-base-content/70">
              <svg
                className="mx-auto h-16 w-16 text-base-content/30 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-base font-medium">Nessun risultato per "{debouncedSearch}"</p>
              <p className="text-sm mt-1">Prova con un termine diverso</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                {results.length} {results.length === 1 ? 'Risultato' : 'Risultati'}
              </div>
              <ul className="space-y-1">
                {results.map((result, index) => (
                  <li key={`${result.type}-${result.id}-${index}`}>
                    <button
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors text-left group"
                    >
                      {/* Badge con icona */}
                      <div className={`badge ${result.type === "clinic" ? "badge-primary" : "badge-secondary"} badge-lg shrink-0`}>
                        <span className="text-lg">{result.type === "clinic" ? "🏥" : "👨‍⚕️"}</span>
                      </div>

                      {/* Info - prende tutto lo spazio disponibile */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base truncate">
                          {result.name}
                        </div>
                        <div className="text-sm text-base-content/70 truncate">
                          {result.description}
                        </div>
                      </div>

                      {/* Freccia - sempre a destra */}
                      <svg
                        className="w-5 h-5 text-base-content/40 group-hover:text-base-content/70 group-hover:translate-x-1 transition-all shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchNav;
