import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(
    req,
    email: string,
    password: string,
    done: CallableFunction,
  ): Promise<any> {
    console.log('2 - passport lokalna strategija validate');

    const provider = req.body.provider;

    const user = await this.authService.validateUser(provider, email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    console.log('lokalna stretegija user', user);
    return done(null, user, { scope: 'read' });
  }
}
