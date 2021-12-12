import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../schemas/user.entity';
import { CreateUserDto } from '../dto/createUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    return await this.userRepository.insert({
      login: user.login,
      email: user.email,
      password: user.password,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}
