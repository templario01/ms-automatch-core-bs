import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface SessionData {
  readonly sub: number;
  readonly iat: number;
  readonly exp: number;
  readonly username: string;
  readonly accountId: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SessionData => {
    const ctx = context.switchToHttp().getRequest()
    return ctx.user;
  },
);
