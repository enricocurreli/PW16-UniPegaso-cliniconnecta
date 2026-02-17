import { useState } from "react";
import Modal from "@/components/Modal";
import { useGet } from "@/hooks/useGet";
import type { Doctor } from "@/interfaces/doctor";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AllDoctors = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useGet<Doctor[]>("/doctors");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const openModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    (document.getElementById("doctor_modal") as HTMLDialogElement)?.showModal();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Errore!</div>;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="py-10">
        <h1 className="md:text-5xl text-5xl font-bold text-white text-center my-5">
          I nostri medici
        </h1>
      </div>

      <div className="grid md:grid-cols-4 gap-6 justify-items-center pb-30">
        {data?.map((doctor) => (
          <div
            className="card bg-base-200 border border-primary w-72 shadow-xl"
            key={doctor.id}
          >
            <div className="card-body grid grid-cols-2 p-3">
              <div>
                <img
                  src="../../public/icons8-user-64.png"
                  className="bg-amber-50 rounded-full w-24"
                  alt=""
                />
              </div>
              <div>
                <h2 className="card-title">
                  {doctor.firstName} {doctor.lastName}
                </h2>
                <h4 className="">
                  {doctor.specialization?.name ?? "Nessuna specializzazione"}
                </h4>
                <button
                  className="text-primary hover:underline hover:underline-offset-4 cursor-pointer"
                  onClick={() => openModal(doctor)}
                >
                  Vedi profilo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <Modal
          id="doctor_modal"
          title={`Profilo - ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
          onClose={() => setSelectedDoctor(null)}
          size="lg"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h1 className="md:text-5xl">Doc. {selectedDoctor.firstName}</h1>
              <h1 className="md:text-5xl">{selectedDoctor.lastName}</h1>
              <h4 className="md:text-2xl py-2">
                {selectedDoctor.specialization?.name ??
                  "Nessuna specializzazione"}
              </h4>
              <h4 className="md:text-xl">Email: {selectedDoctor.user.email}</h4>
              <h4 className="md:text-xl py-2">
                Telefono: {selectedDoctor.phone ?? "Non disponibile"}
              </h4>
            </div>
            <div>
              <p className="md:text-xl pb-2">Biografia:</p>
              <p className="md:text-xl">
                {selectedDoctor.bio ?? "Nessuna biografia disponibile."}
              </p>
            </div>
          </div>
          <div className="modal-action">
            {user && user.role == "PAZIENTE" ? (
                <Link
                  to={`/doctor-availability/${selectedDoctor.id}`}
                  className="btn btn-primary"
                >
                  Vedi disponibilità
                </Link>
              ): !user ? (
                <Link to={"/login"} className="btn btn-primary hover:bg-blue-600">
                  Accedi
                </Link>
              ) : " "
            
            }
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AllDoctors;
