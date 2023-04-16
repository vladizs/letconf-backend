import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from './auth.service';
import { LoginPayload } from './payload/login.payload';
import { RegisterPayload } from './payload/register.payload';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiTags('Authorization')
  @Post('login')
  async login(
    @Body() payload: LoginPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    payload = {
      ...payload,
      username: this.lowerCaseUsername(payload.username),
    };
    const user = await this.authService.validateUser(payload);
    const token = await this.authService.createToken(user);
    res.cookie('LETCONF_TOKEN', token.token, {
      httpOnly: true,
      maxAge: 12 * (60 * 60 * 1000),
    });
    return token;
  }

  @ApiTags('Authorization')
  @Post('register')
  async register(
    @Body() payload: RegisterPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    payload = {
      ...payload,
      username: this.lowerCaseUsername(payload.username),
    };
    const user = await this.usersService.create(payload);
    const token = await this.authService.createToken(user);
    res.cookie('LETCONF_TOKEN', token.token, {
      httpOnly: true,
      maxAge: 12 * (60 * 60 * 1000),
    });
    return token;
  }

  private lowerCaseUsername(username: string): string {
    return username.toLowerCase();
  }
}
