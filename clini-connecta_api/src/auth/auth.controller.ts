import { Controller, Post, Body, Get, Patch } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { RegisterDto } from "./dto/register-auth.dto";
import { LoginDto } from "./dto/login-auth.dto";
import { CurrentUser } from "./decorators/current-user.decorator";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ChangePAsswordDto } from "./dto/change-password.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperation({
    summary: "Registrazione nuovo utente",
    description:
      "Crea un nuovo utente (paziente o medico) e ritorna un token JWT",
  })
  @ApiResponse({
    status: 201,
    description: "Utente registrato con successo",
    schema: {
      example: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: 1,
          email: "mario.rossi@example.com",
          role: "patient",
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "Email già registrata",
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Public()
  @ApiOperation({
    summary: "Login utente",
    description: "Autentica un utente e ritorna un token JWT",
  })
  @ApiResponse({
    status: 200,
    description: "Login effettuato con successo",
    schema: {
      example: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: 1,
          email: "mario.rossi@example.com",
          role: "patient",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Credenziali non valide",
  })
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Get("profile")
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Ottieni profilo utente",
    description: "Ritorna i dati del token JWT dell'utente autenticato",
  })
  @ApiResponse({
    status: 200,
    description: "Profilo utente",
    schema: {
      example: {
        userId: 1,
        email: "mario.rossi@example.com",
        role: "patient",
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Non autenticato",
  })
  @Get("profile")
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Patch('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Cambio password',
    description: 'Permette all\'utente autenticato di cambiare la propria password',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Password modificata con successo',
    schema: {
      example: {
        message: 'Password changed successfully',
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Password attuale errata o nuova password uguale alla vecchia',
    schema: {
      example: {
        statusCode: 400,
        message: 'Current password is incorrect',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Non autenticato',
  })
  changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePAsswordDto,
  ) {
    return this.authService.changePassword(user.sub, changePasswordDto);
  }
}
