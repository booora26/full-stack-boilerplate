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
    if (provider === 'impersonate' && user) {
      console.log('impersonate auth');

      const { password, salt, ...result } = user;
      return { ...result, isTwoFactorAuthenticated: true, provider };
    }
    if (
      provider === 'local' &&
      user &&
      user.password &&
      (await user.validatePassword(password))
    ) {
      console.log('lokalna auth');
      const { password, salt, ...result } = user;
      return { ...result, provider };
    }
    if (provider !== 'local' && user) {
      console.log(`${provider} auth`);

      const { password, salt, ...result } = user;
      return { ...result, provider };
    }

    if (provider !== 'local') {
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
    req.logOut(function (err) {
      if (err) {
        return err;
      }
      // req.session.destroy;
      const clientURL = this.configService.get('CLIENT_URL');
      res.redirect(`${clientURL}/login`);
    });
    // req.session.cookie.maxAge = 0;
    req.session.destroy;
  }

  async logOutImpersonateUser(req, res) {
    req.session.passport.user = req.user.originalUser;
    const clientURL = this.configService.get('CLIENT_URL');
    res.redirect(`${clientURL}`);
  }

  async otherLogIn(req, res) {
    const clientURL = this.configService.get('CLIENT_URL');
    if (!req.user) {
      return console.log('No user');
    }
    if (req.user.isTwoFactorAuthenticationEnabled) {
      return res.redirect(`${clientURL}/2fa`);
    }
    return res.redirect(`${clientURL}`);
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
    console.log(
      'code 2',
      twoFactorAuthenticationCode,
      user.twoFactorAuthenticationSecret,
    );

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
    // res,
  ) {
    const { email } = req.user;
    console.log('be reset pass', email, password, newPassword1, newPassword2);
    const user = await this.usersService.findByEmail(email);

    let updatedUser: UserEntity;
    if (
      (await user.validatePassword(password)) &&
      newPassword1 === newPassword2
    ) {
      updatedUser = await this.usersService.update(user.id, {
        password: newPassword1,
      });
      return updatedUser;
    }
    throw new Error('There is problem with reseting password');
  }
}
