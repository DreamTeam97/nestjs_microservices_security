import {
  applyDecorators,
  UseGuards,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { UserNotFoundGuard } from './guard/user.not-found.guard';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { __user } = ctx.switchToHttp().getRequest();
    return __user;
  },
);

export function UserProfileGuard(): any {
  return applyDecorators(UseGuards(UserNotFoundGuard));
}
