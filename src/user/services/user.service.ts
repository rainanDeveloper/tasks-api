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

  async create(user: CreateUserDto, host: string) {
    try {
      user = await this.transformBody(user);

      const created = await this.userRepository.insert({
        login: user.login,
        email: user.email,
        password: user.password,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const payload = {
        sub: created.raw.insertId,
        login: user.login,
      };

      const token = this.jwtService.sign(payload);

      const link = `${host}/api/userAtivation/${token}`;

      await this.mailService.sendTemplateEmail({
        to: user.email,
        subject: 'User email confirmation',
        template: 'user-confirmation-email',
        context: {
          login: user.login,
          email: user.email,
          link,
          app_name: this.configService.get('APP_NAME'),
        },
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
        is_active: true,
      });

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
