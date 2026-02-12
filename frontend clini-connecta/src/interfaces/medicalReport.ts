export interface MedicalReport {
  id: number;

  reportType: string;

  title: string;

  diagnosis: string;

  treatment: string | null;
}
