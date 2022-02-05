import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../common/services/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private readonly configService: ConfigService = new ConfigService();
  private readonly hashDifficulty: number =
    parseInt(this.configService.get('HASH_DIFFICULTY')) || 12;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private jwtService: JwtService,
  ) {}

  private async bcryptHash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.hashDifficulty);
  }

  private async transformBody(user: CreateUserDto): Promise<CreateUserDto> {
    user.email = user.email.toLocaleLowerCase();

    user.password = await this.bcryptHash(user.password);

    return user;
  }

  async create(user: CreateUserDto) {
    try {
      user = await this.transformBody(user);

      const created = await this.userRepository.insert({
        login: user.login,
        email: user.email,
        password: user.password,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return created;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneByLogin(login: string) {
    try {
      const user = await this.userRepository.findOne({
        login,
      });

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        email,
      });

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
