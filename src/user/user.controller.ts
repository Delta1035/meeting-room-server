import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/constant/config';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { createCaptchaKey } from 'src/utils';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(EmailService)
  private readonly emailService: EmailService;
  @Inject(RedisService)
  private readonly redisService: RedisService;
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(ConfigService)
  private readonly configService: ConfigService;
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

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'dome';
  }

  @Post('login')
  async login(@Body() userDto: LoginUserDto) {
    return await this.loginHandle(userDto);
  }

  @Post('admin/login')
  async adminLogin(@Body() userDto: LoginUserDto) {
    return await this.loginHandle(userDto, true);
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') token: string) {
    return await this.refreshHandler(token);
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') token: string) {
    return await this.refreshHandler(token, true);
  }

  async loginHandle(userDto: LoginUserDto, isAdmin: boolean = false) {
    console.log(userDto);
    const vo = await this.userService.login(userDto, isAdmin);
    const accessTokenPayload: TokenPayload = {
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions,
    };

    vo.accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn:
        this.configService.get(config.JWT_ACCESS_TOKEN_EXPIRES_TIME) || '30m',
    });
    const refreshTokenPayload: TokenPayload = {
      userId: vo.userInfo.id,
    };
    vo.refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn:
        this.configService.get(config.JWT_REFRESH_TOKEN_EXPIRES_TIME) || '1d',
    });
    return vo;
  }

  async refreshHandler(token: string, isAdmin: boolean = false) {
    try {
      const data: TokenPayload = this.jwtService.verify(token);
      const user = await this.userService.findUserById(data.userId, isAdmin);
      const accessTokenPayload: TokenPayload = { userId: user.id };
      const accessToken = this.jwtService.sign(accessTokenPayload, {
        expiresIn:
          this.configService.get(config.JWT_ACCESS_TOKEN_EXPIRES_TIME) || '30m',
      });

      const refreshTokenPayload: TokenPayload = { userId: user.id };
      const refreshToken = this.jwtService.sign(refreshTokenPayload, {
        expiresIn:
          this.configService.get(config.JWT_REFRESH_TOKEN_EXPIRES_TIME) || '1d',
      });
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('token失效');
    }
  }
}
