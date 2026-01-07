import {
  IsString,
  IsNotEmpty,
  IsEnum,
  MinLength,
  IsEmail,
} from "class-validator";
import { RoleStatus } from "../../enums/db-enum.enum";


export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(RoleStatus)
  role: RoleStatus;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
