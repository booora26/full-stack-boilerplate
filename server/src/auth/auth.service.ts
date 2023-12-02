import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly employeeService: EmployeesService,
    private readonly configService: ConfigService,
  ) {}

  clientURL =
    this.configService.get('NODE_ENV') === 'DEVELOPMENT'
      ? this.configService.get('CLIENT_DEV_URL')
      : this.configService.get('CLIENT_PROD_URL');

  async register(entity) {
    console.log(entity);

    const { email, password } = entity;
    const user = await this.usersService.findByEmail(email);

    if (user && !user.password) {
      return await this.usersService.update(user.id, {
        password,
      });
    }

    if (user) {
      throw new Error('user alrady exists');
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
    let employee;
    if (!user) {
      employee = await this.employeeService.findByEmail(email);
    }

    console.log(provider, user);

    if (
      provider === 'local' &&
      employee &&
      employee.password &&
      (await employee.validatePassword(password))
    ) {
      console.log('lokalna auth za emplyee');
      const { password, salt, ...result } = employee;
      return { ...result, provider };
    }

    if (user) {
      if (provider === 'impersonate') {
        console.log('impersonate auth');
        const { password, salt, ...result } = user;
        return { ...result, isTwoFactorAuthenticated: true, provider };
      }

      if (
        provider === 'local' &&
        user.password &&
        (await user.validatePassword(password))
      ) {
        console.log('lokalna auth');
        const { password, salt, ...result } = user;
        return { ...result, provider };
      }

      if (provider !== 'local') {
        console.log(`${provider} auth`);
        const { password, salt, ...result } = user;
        return { ...result, provider };
      }
    } else if (provider !== 'local') {
      console.log(`${provider} new user`);
      const newUser = new UserEntity();
      newUser.email = email;
      newUser.externalProvider = true;
      const result = await this.usersService.create(newUser);
      return { ...result, provider };
    }

    console.log('no auth');
    return null;
  }

  async logOut(req, res) {
    req.logOut((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error logging out');
        return;
      }
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error destroying session');
          return;
        }
        res.redirect(`${this.clientURL}`);
      });
    });
  }

  async logOutImpersonateUser(req, res) {
    try {
      req.session.passport.user = req.user.originalUser;
      console.log('client url', process.env.NODE_ENV);
      res.redirect(`${this.clientURL}`);
    } catch (error) {
      console.error('Error in logOutImpersonateUser:', error);
      res.status(500).send('Error logging out impersonated user');
    }
  }

  async otherLogIn(req, res) {
    try {
      console.log('client url', process.env.NODE_ENV);

      if (!req.user) {
        console.log('No user');
        return;
      }

      const redirectUrl = req.user.isTwoFactorAuthenticationEnabled
        ? `${this.clientURL}/2fa`
        : `${this.clientURL}`;
      await res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error in otherLogIn:', error);
      res.status(500).send('Error during login');
    }
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

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersService.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: UserEntity,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  async resetPassword(
    password: string,
    newPassword1: string,
    newPassword2: string,
    req,
  ) {
    const { email } = req.user;

    const user = await this.usersService.findByEmail(email);

    if (!(await user.validatePassword(password))) {
      throw new Error('Invalid current password');
    }

    if (newPassword1 !== newPassword2) {
      throw new Error('New passwords do not match');
    }

    const updatedUser = await this.usersService.update(user.id, {
      password: newPassword1,
    });

    return updatedUser;
  }
}
