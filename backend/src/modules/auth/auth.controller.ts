import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

class TelegramLoginDto {
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
  async telegramLogin(@Body() dto: TelegramLoginDto) {
    console.log('Telegram login request body:', dto);
    console.log('Code from body:', dto?.code);
    return this.authService.loginWithTelegramCode(dto?.code);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }
}
