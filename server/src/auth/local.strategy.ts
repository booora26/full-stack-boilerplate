import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('2 - passport lokalna strategija validate');

    const provider = 'local';

    const user = await this.authService.validateUser(provider, email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
