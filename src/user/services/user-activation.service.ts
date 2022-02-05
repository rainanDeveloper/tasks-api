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
  ) {}

  async create(createUserActivationDto: CreateUserActivationDto) {
    const created = this.userActivationRepository.create({
      email: createUserActivationDto.email,
      user: createUserActivationDto.user,
      otgCode: Math.random().toString().slice(-6),
      created_at: new Date(),
      updated_at: new Date(),
    });

    return await this.userActivationRepository.save(created);
  }
}
