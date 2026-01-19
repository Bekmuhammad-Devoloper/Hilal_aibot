import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

// Telegram login kodlari (xotirada saqlaymiz)
const telegramLoginCodes: Map<string, { telegramId: string; expiresAt: Date }> = new Map();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await this.usersService.validatePassword(user, password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  // Telegram orqali login uchun kod yaratish
  generateTelegramLoginCode(telegramId: string): string {
    // 6 raqamli kod
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 5 daqiqa amal qiladi
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    telegramLoginCodes.set(code, { telegramId, expiresAt });
    
    // Eskilarini tozalash
    this.cleanupExpiredCodes();
    
    return code;
  }

  // Telegram kodi bilan login
  async loginWithTelegramCode(code: string) {
    const data = telegramLoginCodes.get(code);
    
    if (!data) {
      throw new UnauthorizedException('Invalid or expired code');
    }
    
    if (new Date() > data.expiresAt) {
      telegramLoginCodes.delete(code);
      throw new UnauthorizedException('Code expired');
    }
    
    // Admin ID larni tekshirish
    const adminIds = this.configService.get('ADMIN_IDS', '').split(',');
    if (!adminIds.includes(data.telegramId)) {
      throw new UnauthorizedException('Not authorized as admin');
    }
    
    // Kodni o'chirish (bir martalik)
    telegramLoginCodes.delete(code);
    
    // Token yaratish
    const payload = { 
      sub: data.telegramId, 
      username: `telegram_${data.telegramId}`, 
      role: 'admin',
      isTelegramAuth: true,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: data.telegramId,
        username: `Admin (Telegram)`,
        role: 'admin',
      },
    };
  }

  private cleanupExpiredCodes() {
    const now = new Date();
    for (const [code, data] of telegramLoginCodes.entries()) {
      if (now > data.expiresAt) {
        telegramLoginCodes.delete(code);
      }
    }
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
