import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_CLIENT } from 'src/constant/provide';
import { RedisService } from './redis.service';

@Module({
  providers: [
    RedisService,
    {
      provide: REDIS_CLIENT,
      useFactory: async () => {
        const client = createClient({
          socket: { host: 'localhost', port: 6379 },
          database: 1,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
