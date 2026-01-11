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

export class DoctorDTO {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  bio: string;

  @Expose()
  phone: string;

  @Expose()
  licenseNumber: string;
  
  @Expose()
  specialization: string;

  @Expose()
  address: string;

  @Exclude()
  createdAt: Date;

  @Expose()
  @Type(() => UserNestedDTO)
  user: UserNestedDTO;
}
