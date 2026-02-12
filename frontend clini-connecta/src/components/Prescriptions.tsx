import { useGet } from "@/hooks/useGet";
import type { Prescription } from "@/interfaces/prescriptions";
interface PrescriptionProps {
  id: number;
}
const Prescriptions = ({ id }: PrescriptionProps) => {
  const { data, isLoading, error } = useGet<Prescription[]>(
    `/prescriptions/${id}`,
  );
const API_BASE_URL = "http://localhost:3000";

  if (isLoading) {
    return <div>Caricamento prescrizioni...</div>;
  }

  if (error) {
    return <div className="text-red-600">Errore nel caricamento.</div>;
  }

  if (!data || data.length === 0) {
    return <div>Nessuna prescrizione trovata.</div>;
  }

  return (
     <div className="space-y-4">
      {data.map((prescription) => {
        const downloadUrl = prescription.filePath
          ? `${API_BASE_URL}${prescription.filePath}`
          : null;

        return (
          <div
            key={prescription.id}
            className="card bg-base-200 shadow p-4 space-y-2"
          >
            <p>
              <span className="font-semibold">Farmaco:</span>{" "}
              {prescription.medicationName}
            </p>
            <p>
              <span className="font-semibold">Dosaggio:</span>{" "}
              {prescription.dosage}
            </p>
            <p>
              <span className="font-semibold">Frequenza:</span>{" "}
              {prescription.frequency}
            </p>
            <p>
              <span className="font-semibold">Periodo:</span>{" "}
              {prescription.startDate} – {prescription.endDate}
            </p>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                className="btn btn-outline btn-primary mt-2"
                target="_blank"
              >
                Scarica prescrizione
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Prescriptions;
