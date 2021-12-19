import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { User } from './schemas/user.entity';
import { UserService } from './services/user.service';
import { UserAuthController } from './controllers/user-auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, UserAuthController],
  providers: [UserService],
})
export class UserModule {}
