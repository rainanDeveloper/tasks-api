import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/createUserDto';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }
}
