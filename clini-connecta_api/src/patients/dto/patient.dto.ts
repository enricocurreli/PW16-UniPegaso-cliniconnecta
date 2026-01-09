import { Exclude, Expose, Type } from "class-transformer";
import { Gender } from "../../enums/db-enum.enum";

// DTO per l'oggetto user annidato
export class UserNestedDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;
}

export class PatientDTO {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  gender: Gender;

  @Expose()
  cityOfBirth: string;
  
  @Expose()
  provinceOfBirth: string;
  @Expose()
  phone: string;

  @Expose()
  fiscalCode: string;

  @Expose()
  address: string;

  @Exclude()
  createdAt: Date;

  @Expose()
  @Type(() => UserNestedDTO)
  user: UserNestedDTO;
}
