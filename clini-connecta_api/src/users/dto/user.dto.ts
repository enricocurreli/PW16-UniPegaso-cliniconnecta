import { RoleStatus } from "../../enums/db-enum.enum";

export class UserDTO {
  sub: number;
  email: string;
  role: RoleStatus;
  iat: number;
  exp: number;
}
