import { CacheModule, Module } from '@nestjs/common';
import { Task } from './schemas/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: configService.get('CACHE_TTL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
