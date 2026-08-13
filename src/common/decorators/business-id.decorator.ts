import { UsersEntity } from '@database';
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export const BusinessId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number => {
    const user: UsersEntity = context.switchToHttp().getRequest().user;

    if (!user.business_id) {
      throw new ForbiddenException("Kechirasiz!, ruxsat yo'q");
    }
    return user.business_id;
  },
);
