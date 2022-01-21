import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const configService: ConfigService = new ConfigService();

        const config: any = {
          type: configService.get('DATABASE_DIALECT') || 'mysql',
          host: configService.get('DATABASE_HOST') || 'localhost',
          port: configService.get('DATABASE_PORT') || '3306',
          username: configService.get('DATABASE_USERNAME') || 'root',
          password: configService.get('DATABASE_PASSWORD') || 'root',
          database: configService.get('DATABASE_NAME') || 'task_manager',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };

        return config;
      },
    }),
    CommonModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
