import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { CustomerSession } from '../../auth/types/jwt.payload';

export const CurrentUser = createParamDecorator(
  (data: keyof CustomerSession | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CustomerSession | undefined;

    if (!user) {
      return undefined;
    }

    return data ? user[data] : user;
  },
);
