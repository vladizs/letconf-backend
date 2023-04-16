import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/modules/users/users.schema';
import { UsersService } from 'src/modules/users/users.service';
import { LoginPayload } from './payload/login.payload';

export interface ITokenReturnBody {
  expires: string;
  token: string;
}

@Injectable()
export class AuthService {
  private readonly expiration: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.expiration = '7d';
  }

  async createToken({ _id, username, roles }: UserDocument) {
    return {
      expires: this.expiration,
      token: this.jwtService.sign({ _id, username, roles }),
    };
  }

  async validateUser(payload: LoginPayload) {
    const user = await this.usersService.getByUsernamePass(
      payload.username,
      payload.password,
    );
    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }
    return user;
  }
}
