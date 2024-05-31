import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUIRE_PERMISSION } from './constant/provide';
import { TokenPayload } from './user/interfaces/token-payload.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // TODO guard是否有顺序？
    if (!request.user) {
      return true;
    }
    // 获取访问接口需要的权限列表
    const requiredPermissionList = this.reflector.getAllAndOverride(
      REQUIRE_PERMISSION,
      [context.getClass(), context.getHandler()],
    ) as string[] | null;

    // 如果没有权限要求，则直接通过
    if (!requiredPermissionList) {
      return true;
    }
    const user: TokenPayload = request.user;
    const userPermissions = user.permissions;
    requiredPermissionList.forEach((requiredPermissionCode) => {
      if (!userPermissions.find((up) => up.code === requiredPermissionCode)) {
        throw new UnauthorizedException('没有权限');
      }
    });
    return true;
  }
}
