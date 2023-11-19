import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID:
        '295303506149-s29dmujtk4l7svc1e5rvif8dlte027de.apps.googleusercontent.com',
      clientSecret: 'kYSCx_5Ucnttg0DuiE_EdMs_',
      // callbackURL: `${configService.get('SERVER_URL')}/auth/google/callback`,
      callbackURL: `http://localhost:4010/auth/google/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req,
    accessToken: string,
    refreshToken: string,
    profile: any,
    // done: VerifyCallback,
  ): Promise<any> {
    console.log(`2 - passport google strategija validate`);

    const { emails, provider } = profile;
    const email = emails[0].value;

    const user = await this.authService.validateUser(provider, email);
    if (!user) {
      throw new UnauthorizedException();
    }

    console.log(`${provider} profile`, profile);

    return user;
  }
}
