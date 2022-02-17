import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { User } from './schemas/user.entity';
import { UserService } from './services/user.service';
import { UserAuthController } from './controllers/user-auth.controller';
import { UserAuthService } from './services/user-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PassportModule } from '@nestjs/passport';
import { UserActivation } from './schemas/user-activation.entity';
import { UserActivationService } from './services/user-activation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserActivation]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret =
          configService.get<string>('JWT_SECRET') ||
          crypto.randomBytes(63).toString('base64');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '1d';
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController, UserAuthController],
  providers: [UserService, UserAuthService, UserActivationService],
})
export class UserModule {}
