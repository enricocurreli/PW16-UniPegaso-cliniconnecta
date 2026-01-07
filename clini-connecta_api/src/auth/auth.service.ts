import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register-auth.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login-auth.dto";
import { ChangePAsswordDto } from "./dto/change-password.dto";
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, ...userData } = registerDto;

    const cryptedPass = await this.hashPassword(password);

    // usando lo spread operator , recupero tutti i dati esistenti ma modifico solo la password
    const user = await this.usersService.createUser({
      ...userData,
      password: cryptedPass,
    });
    const accessToken = await this.generateToken(
      user.id,
      user.email,
      user.role
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = await this.generateToken(
      user.id,
      user.email,
      user.role
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateUser(userId: number) {
    return await this.usersService.findById(userId);
  }

  async logout() {
    // Con JWT stateless, il logout è lato client (rimuove token)
    // Opzionale: implementa token blacklist in Redis
    return { message: "Logout successful" };
  }

  async changePassword(userId: number, changePasswordDto: ChangePAsswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usersService.findByIdWithPassword(userId);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const isCurrentPasswordValid = await this.validatePassword(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException("Current password is incorrect");
    }

    const isSamePassword = await this.validatePassword(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      throw new BadRequestException(
        "New password must be different from current password"
      );
    }

    const hashedNewPassword = await this.hashPassword(newPassword);

    await this.usersService.updatePassword(userId, hashedNewPassword);

    return {
      message: "Password changed successfully",
    };
  }

  // DOCS -> https://docs.nestjs.com/security/authentication#jwt-token
  //? È una convenzione usare `sub` per l'ID utente invece di `userId`

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private async generateToken(
    userId: number,
    email: string,
    role: string
  ): Promise<string> {
    const payload = { sub: userId, email, role };
    return await this.jwtService.signAsync(payload);
  }
}
