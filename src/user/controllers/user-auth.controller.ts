import { Controller, Post, Body } from '@nestjs/common';
import { UserAuthService } from '../services/user-auth.service';
import { UserLoginDto } from '../dto/user-login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user-auth')
@ApiTags('Users auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post()
  async login(@Body() loginDto: UserLoginDto) {
    return await this.userAuthService.login(loginDto);
  }
}
