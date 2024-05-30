import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { RedisModule } from 'src/redis/redis.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
