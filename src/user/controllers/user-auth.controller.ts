import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserAuthService } from '../services/user-auth.service';
import { UserLoginDto } from '../dto/user-login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user-auth')
@ApiTags('Users auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post()
  async login(@Body() loginDto: UserLoginDto) {
    try {
      return await this.userAuthService.login(loginDto);
    } catch (error) {
      throw new UnauthorizedException(
        `Error during authentication: ${error.message}`,
      );
    }
  }
}
