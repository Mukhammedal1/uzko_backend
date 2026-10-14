import { UsersEntity } from '@database';
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number => {
    const user: UsersEntity = context.switchToHttp().getRequest().user;

    if (!user.id) {
      throw new ForbiddenException("Kechirasiz!, ruxsat yo'q");
    }
    return user.id;
  },
);
