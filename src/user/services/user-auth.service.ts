import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from '../dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  private async comparePasswords(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login(loginDto: UserLoginDto) {
    const genericMessage = 'login or password incorrect';

    try {
      const user = await this.userService.findOneByLogin(loginDto.login);

      if (!user) {
        throw new Error(genericMessage);
      }

      if (!(await this.comparePasswords(loginDto.password, user.password))) {
        throw new Error(genericMessage);
      }

      const payload = {
        sub: user.id,
        login: user.login,
        created_at: user.created_at,
      };

      const token = this.jwtService.sign(payload);

      return {
        login: user.login,
        email: user.email,
        token,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
