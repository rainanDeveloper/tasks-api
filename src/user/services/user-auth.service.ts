import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from '../dto/user-login.dto';

@Injectable()
export class UserAuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(login: UserLoginDto) {
    return;
  }
}
