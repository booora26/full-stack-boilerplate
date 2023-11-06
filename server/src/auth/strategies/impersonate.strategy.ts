import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class ImpersonateStrategy extends PassportStrategy(
  Strategy,
  'impersonate',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'email',
      passReqToCallback: true,
    });
  }
  async validate(req, email, _, done: CallableFunction): Promise<any> {
    console.log('2 - passport lokalna strategija validate');

    const provider = req.body.provider;

    const user = await this.authService.validateUser(provider, email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const { twoFactorAuthenticationSecret, ...rest } = user;
    const { twoFactorAuthenticationSecret: originalUser2FAS, ...originalUser } =
      req.originalUser;

    return done(null, { ...rest, originalUser }, { scope: 'read' });
  }
}
