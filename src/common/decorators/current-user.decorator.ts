import { UsersEntity } from '@database';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const getCurrentUserByContext = (
  context: ExecutionContext,
): UsersEntity => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
