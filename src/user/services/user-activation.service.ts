import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserActivationDto } from '../dto/create-user-activation.dto';
import { UserActivation } from '../schemas/user-activation.entity';
import { FindUserActivationByOtgDto } from '../dto/find-user-activation-by-otg.dto';

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

  async findOneByOtgCodeAndEmail(findDto: FindUserActivationByOtgDto) {
    return this.userActivationRepository.findOne({
      where: findDto,
    });
  }

  async delete(id: number) {
    const userActivation = await this.userActivationRepository.findOne(id);

    if (!userActivation)
      throw new NotFoundException('User activation record not found!');

    return await this.userActivationRepository.delete(id);
  }
}
