export interface Prescription {
  id: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  filePath: string | null;
  startDate: string;      
  endDate: string;         
  reportId: number;
}
