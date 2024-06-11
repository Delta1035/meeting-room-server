import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './constant/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  try {
    await app.listen(configService.get(config.NEST_SERVER_PORT));
  } catch (error) {
    console.log('启动错误:>>>>', error);
  }
}
bootstrap();
