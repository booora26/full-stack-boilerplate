import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class TwoFAStrategy extends PassportStrategy(Strategy, 'TwoFA') {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(
    req,
    email: string,
    password: string,
    done: CallableFunction,
  ): Promise<any> {
    console.log('2 - passport 2fa strategija validate');

    const isCodeValid =
      await this.authService.isTwoFactorAuthenticationCodeValid(
        req.body.twoFactorAuthenticationCode,
        req.user,
      );

    console.log('is code valid', isCodeValid);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    console.log('req user', req.user);
    const { twoFactorAuthenticationSecret, ...results } = req.user;

    if (!results.isTwoFactorAuthenticationEnabled) {
      return done(null, results);
    }
    if (isCodeValid) {
      console.log('dobar kod', isCodeValid);
      return done(null, { ...results, isTwoFactorAuthenticated: true });
    }
  }
}
