import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async register(entity) {
    const { email, password } = entity;
    const user = await this.usersService.findByEmail(email);

    if (!user.password) {
      return await this.usersService.update(user.id, {
        password,
      });
    }

    return this.usersService.create(entity);
  }

  async validateUser(
    provider: string,
    email: string,
    password?: string,
  ): Promise<any> {
    console.log('3 - auth service ValidateUser');

    const user = await this.usersService.findByEmail(email);
    console.log(provider);
    if (provider === 'impersonate' && user) {
      console.log('impersonate auth');

      const { password, salt, ...result } = user;
      return result;
    }
    if (
      provider === 'local' &&
      user &&
      user.password &&
      (await user.validatePassword(password))
    ) {
      console.log('lokalna auth');
      const { salt, ...result } = user;
      return result;
    }
    if (provider !== 'local' && user) {
      console.log(`${provider} auth`);

      const { password, salt, ...result } = user;
      return result;
    }

    if (provider !== 'local') {
      console.log(`${provider} new user`);

      const newUser = new UserEntity();
      newUser.email = email;
      newUser.externalProvider = true;
      return await this.usersService.create(newUser);
    }

    console.log('no auth');

    return null;
  }

  async logOut(req, res) {
    req.logOut(function (err) {
      if (err) {
        return err;
      }
      // req.session.destroy;
      res.redirect('http://localhost:3010');
    });
    // req.session.cookie.maxAge = 0;
    req.session.destroy;
  }

  async logOutImpersonateUser(req, res) {
    req.session.passport.user = req.user.originalUser;
    res.redirect('http://localhost:3010');
  }

  async otherLogIn(req, res) {
    if (!req.user) {
      return console.log('No user');
    }
    return res.redirect('http://localhost:3010');
  }

  async generateTwoFactorAuthenticationSecret(user: UserEntity) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }
  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: UserEntity,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
