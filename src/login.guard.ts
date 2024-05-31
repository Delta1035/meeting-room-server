import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { REQUIRE_LOGIN } from './constant/provide';
import { TokenPayload } from './user/interfaces/token-payload.interface';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request & { user: TokenPayload } = context
      .switchToHttp()
      .getRequest();
    // 从controller class和controller handle上面获取元数据
    const requireLogin = this.reflector.getAllAndOverride(REQUIRE_LOGIN, [
      context.getClass(),
      context.getHandler(),
    ]);
    // 如果找到，则说明需要登录
    if (!requireLogin) {
      return true;
    }
    const token = request.headers['authorization'] as string;

    if (!token) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      // 说明需要登录，切从header里面拿到了token
      const payload = this.jwtService.verify<TokenPayload>(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('无效的token,请重新登录');
    }
  }
}
