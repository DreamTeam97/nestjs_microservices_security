import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from '../user.constant';

export class UserNotFoundGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const { __user } = context.switchToHttp().getRequest();

    if (!__user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }
    return true;
  }
}
