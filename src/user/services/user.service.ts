import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../common/services/mail.service';
import { UserActivationService } from './user-activation.service';

@Injectable()
export class UserService {
  private readonly configService: ConfigService = new ConfigService();
  private readonly hashDifficulty: number =
    parseInt(this.configService.get('HASH_DIFFICULTY')) || 12;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private userActivationService: UserActivationService,
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

  async update(userId: number, updateQuery: any) {
    return await this.userRepository.update(userId, updateQuery);
  }

  async activateUser(id: number) {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException('User not found!');

    const created = await this.userActivationService.create({
      email: user.email,
      user,
    });

    if (!created) throw new Error();

    this.mailService.sendTemplateEmail({
      template: 'user-activation-email',
      to: user.email,
      subject: 'Confirme seu usuário em nossa plataforma',
      context: {
        login: user.login,
        otgCode: created.otgCode,
        app_name: this.configService.get('APP_NAME'),
      },
    });

    return created;
  }
}
