import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { config } from 'src/constant/config';
import { REDIS_CLIENT } from 'src/constant/provide';
import { RedisService } from './redis.service';

@Module({
  providers: [
    RedisService,
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          socket: {
            host: configService.get(config.REDIS_SERVER_HOST),
            port: configService.get(config.REDIS_SERVER_PORT),
          },
          database: configService.get(config.REDIS_SERVER_DB),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
