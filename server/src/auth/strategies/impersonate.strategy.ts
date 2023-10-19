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
  async validate(req, email): Promise<any> {
    console.log('2 - passport lokalna strategija validate');

    const provider = req.body.provider;

    const user = await this.authService.validateUser(provider, email);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
