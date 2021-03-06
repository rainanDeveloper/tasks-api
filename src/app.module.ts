import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { TaskModule } from './task/task.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const configService: ConfigService = new ConfigService();

        const config: any = {
          type: configService.get('DATABASE_DIALECT') || 'mysql',
          host: configService.get('DATABASE_HOST') || 'database', // Defaults to docker alias
          port: configService.get('DATABASE_DOCKER_PORT') || '3306',
          username: configService.get('DATABASE_USERNAME') || 'root',
          password: configService.get('DATABASE_PASSWORD') || '',
          database: configService.get('DATABASE_NAME') || 'task_manager',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };

        return config;
      },
    }),
    CommonModule,
    UserModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
