import Button from "@/components/Button";
import { useGet } from "@/hooks/useGet";
import type { Clinic as ClinicType } from "@/interfaces/clinic";
import type { DoctorClinics } from "@/interfaces/doctor";
import { useNavigate, useParams } from "react-router-dom";

const ClinicDetail = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();

  const { data: clinic, isLoading: loadingClinic } = useGet<ClinicType>(
    `/clinics/${clinicId}`,
  );

  const { data: doctorClinics, isLoading: loadingDoctors } = useGet<
    DoctorClinics[]
  >(`/doctor-clinics/clinic/${clinicId}/doctors`);

  if (loadingClinic || loadingDoctors) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="alert alert-error m-4">
        <span>Clinica non trovata</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{clinic.name}</h1>
              <p className="text-xl opacity-90 flex items-center gap-2">
                <span>📍</span>
                {clinic.address}, {clinic.city} {clinic.postalCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonna principale - Medici */}
          <div className="lg:col-span-2">
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">
                  Medici disponibili ({doctorClinics?.length || 0})
                </h2>

                {doctorClinics && doctorClinics.length > 0 ? (
                  <div className="space-y-4">
                    {doctorClinics.map((dc) => (
                      <div
                        key={dc.id}
                        className="card bg-base-100 shadow-md hover:shadow-xl transition"
                      >
                        <div className="card-body">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Avatar */}
                            <div className="avatar placeholder">
                              <div className="bg-primary text-white rounded-full w-16 h-16">
                                <img
                                  src="/icons8-user-64.png"
                                  className="bg-amber-50 rounded-full w-24"
                                  alt="Avatar medico"
                                />
                              </div>
                            </div>

                            {/* Info medico */}
                            <div className="flex-1 space-x-2">
                              <h3 className="text-xl font-bold">
                                Dr. {dc.doctor.firstName} {dc.doctor.lastName}
                              </h3>

                              {/* Licenza */}
                              <div className="badge badge-outline badge-lg mt-2">
                                {dc.doctor.licenseNumber}
                              </div>
                              {/* Specializzazione */}
                              <div className="badge badge-outline badge-accent badge-lg mt-2">
                                {dc.doctor.specialization.name}
                              </div>
                              {/* Bio */}
                              {dc.doctor.bio && (
                                <p className="text-sm text-base-content/70 mt-3 line-clamp-3">
                                  {dc.doctor.bio}
                                </p>
                              )}

                              {/* Contatti */}
                              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <span>📞</span>
                                  <a
                                    href={`tel:${dc.doctor.phone}`}
                                    className="link link-hover"
                                  >
                                    {dc.doctor.phone}
                                  </a>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>✉️</span>
                                  <a
                                    href={`mailto:${dc.doctor.user.email}`}
                                    className="link link-hover"
                                  >
                                    {dc.doctor.user.email}
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Pulsante prenota */}
                            <div className="flex items-center">
                              <Button
                                onClick={() =>
                                  navigate(
                                    `/doctor-availability/${dc.doctor.id}`,
                                  )
                                }
                                classes="btn btn-primary"
                              >
                                Prenota Visita
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-base-content/70">
                      Nessun medico disponibile al momento
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Info clinica */}
          <div className="space-y-4">
            <div className="card bg-base-200 shadow-lg sticky top-4">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4"> Informazioni</h3>

                <div className="space-y-4">
                  {/* Indirizzo */}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-semibold">Indirizzo</p>
                      <p className="text-sm text-base-content/70">
                        {clinic.address}
                        <br />
                        {clinic.postalCode} {clinic.city}
                      </p>
                    </div>
                  </div>

                  {/* Telefono */}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-semibold">Telefono</p>
                      <a
                        href={`tel:${clinic.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {clinic.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Azioni */}
                <div className="space-y-2">
                  <Button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address + ", " + clinic.city)}`,
                        "_blank",
                      )
                    }
                    classes="btn btn-outline btn-block"
                  >
                    Vedi sulla mappa
                  </Button>
                  <Button
                    onClick={() =>
                      (window.location.href = `tel:${clinic.phone}`)
                    }
                    classes="btn btn-outline btn-block"
                  >
                    Chiama ora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicDetail;
