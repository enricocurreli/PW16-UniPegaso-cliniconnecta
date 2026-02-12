import type { UserNested } from "./doctor";

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  cityOfBirth: string;
  provinceOfBirth: string;
  gender:string;
  phone: string;
  fiscalCode:string;
  address: string;
  user: UserNested;
}
