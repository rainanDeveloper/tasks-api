import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserActivationDto } from '../dto/create-user-activation.dto';
import { UserActivation } from '../schemas/user-activation.entity';
import { UserService } from './user.service';

@Injectable()
export class UserActivationService {
  constructor(
    @InjectRepository(UserActivation)
    private readonly userActivationRepository: Repository<UserActivation>,
    private readonly userService: UserService,
  ) {}

  async create(createUserActivationDto: CreateUserActivationDto) {
    const created = this.userActivationRepository.create({
      email: createUserActivationDto.email,
      created_at: new Date(),
      updated_at: new Date(),
    });

    created.user = await this.userService.findOneByEmail(
      createUserActivationDto.email,
    );

    return await this.userActivationRepository.save(created);
  }
}
