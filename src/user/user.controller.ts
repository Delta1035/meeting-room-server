import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { createCaptchaKey } from 'src/utils';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(EmailService)
  private readonly emailService: EmailService;
  @Inject(RedisService)
  private readonly redisService: RedisService;
  constructor() {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    console.log(registerUser);
    await this.userService.register(registerUser);
    return 'success';
  }

  @Get('register-captcha')
  async registerCaptcha(@Query('address') address: string) {
    const captcha = Math.random().toString().substr(2, 6);
    await this.redisService.set(createCaptchaKey(address), captcha, 60);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${captcha}</p>`,
    });
    return '发送成功';
  }
}
