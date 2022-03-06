import {
  BadRequestException,
  Body,
  Controller,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { FindUserActivationByOtgDto } from '../dto/find-user-activation-by-otg.dto';
import { UserActivationService } from '../services/user-activation.service';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userActivationService: UserActivationService,
  ) {}

  @Post()
  async create(@Body() user: CreateUserDto) {
    try {
      return await this.userService.create(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/activate')
  async activateUser(@Body() userActivationDto: FindUserActivationByOtgDto) {
    const existentUserActivation =
      await this.userActivationService.findOneByOtgCodeAndEmail(
        userActivationDto,
      );

    if (!existentUserActivation)
      throw new NotFoundException('User activation record not found!');

    const userFinded = await this.userService.findOneByEmail(
      userActivationDto.email,
    );

    if (!userFinded) throw new NotFoundException('User not found!');

    this.userService.update(userFinded.id, {
      is_active: true,
    });

    this.userActivationService.delete(existentUserActivation.id);

    return {
      success: true,
      message: 'User activated!',
    };
  }
}
