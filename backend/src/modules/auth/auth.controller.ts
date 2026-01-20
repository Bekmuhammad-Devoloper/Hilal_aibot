import { Controller, Post, Body, Get, UseGuards, Request, Req, RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IsString, IsNotEmpty } from 'class-validator';

export class TelegramLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('telegram-login')
  async telegramLogin(@Body() body: any) {
    console.log('=== TELEGRAM LOGIN DEBUG ===');
    console.log('Raw body:', body);
    console.log('Body type:', typeof body);
    console.log('Body keys:', Object.keys(body || {}));
    console.log('Code value:', body?.code);
    console.log('============================');
    
    const code = body?.code;
    if (!code) {
      return { error: 'Code is required', receivedBody: body };
    }
    
    return this.authService.loginWithTelegramCode(code);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }
}
