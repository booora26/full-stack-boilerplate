import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TwoFAGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user.isTwoFactorAuthenticationEnabled) {
      return true;
    }
    if (user.is2FA) {
      return true;
    }
  }
}
