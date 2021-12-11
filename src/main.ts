import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function configureSwagger(app: INestApplication, configService: ConfigService) {
  const config = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME'))
    .setDescription(
      `This is a documentation for the api ${configService.get('APP_NAME')}`,
    )
    .setVersion(configService.get('APP_VERSION'))
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(
    configService.get('APP_DOCS_PATH') || 'docs',
    app,
    document,
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const configService = new ConfigService();

  configureSwagger(app, configService);

  await app.listen(3000);
}
bootstrap();
