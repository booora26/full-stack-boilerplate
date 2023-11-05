import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decotators/public.decorator';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log('auth guard');

    console.log('req user', request.user);

    if (!request.user) return false;

    const { isTwoFactorAuthenticationEnabled, isTwoFactorAuthenticated } =
      request.user;
    if (
      request.isAuthenticated() &&
      isTwoFactorAuthenticationEnabled === false
    ) {
      console.log('auth bez 2fa');
      return true;
    }
    if (
      request.isAuthenticated() &&
      isTwoFactorAuthenticationEnabled === true
    ) {
      console.log('auth uspesno sa  2fa', isTwoFactorAuthenticated);
      return isTwoFactorAuthenticated;
    }
  }
}
