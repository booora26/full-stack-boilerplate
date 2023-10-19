import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: '127b1911339a83de08a8',
      clientSecret: '02d7e0c243c64fef24f90aba64b13fa2a6e3f11a',
      callbackURL: 'http://localhost:4010/auth/github/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    console.log('2 - passport github strategija validate');

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
