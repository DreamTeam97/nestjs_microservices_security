import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ENUM_AUTH_STATUS_CODE_ERROR } from 'src/authentication/auth.constant';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: Record<string, any>, user: any): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode:
          ENUM_AUTH_STATUS_CODE_ERROR.AUTH_GUARD_JWT_ACCESS_TOKEN_ERROR,
        message: 'http.clientError.unauthorized',
      });
    }
    return user;
  }
}
