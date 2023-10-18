import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID:
        '295303506149-s29dmujtk4l7svc1e5rvif8dlte027de.apps.googleusercontent.com',
      clientSecret: 'kYSCx_5Ucnttg0DuiE_EdMs_',
      callbackURL: 'http://localhost:4010/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    // done: VerifyCallback,
  ): Promise<any> {
    console.log('2 - passport lokalna strategija validate');

    const { name, emails, photos } = profile;
    const email = emails[0].value;
    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    //   photo: photos[0].value,
    //   accessToken,
    // };
    const provider = 'other';
    const user = await this.authService.validateUser(provider, email);

    console.log('google user', user);
    return user;
  }
}