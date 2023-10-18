import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    provider: string,
    email: string,
    password?: string,
  ): Promise<any> {
    console.log('3 - auth service ValidateUser');
    console.log('email', email);

    const user = await this.usersService.findByEmail(email);
    if (
      provider === 'local' &&
      user &&
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
      console.log('social new user');
    }

    console.log('no auth');

    return null;
  }

  async logOut(req, res) {
    req.logOut(function (err) {
      if (err) {
        return err;
      }
      res.redirect('http://localhost:3010');
    });
    // req.session.cookie.maxAge = 0;
    req.session.destroy;
  }

  async otherLogIn(req, res) {
    if (!req.user) {
      return console.log('No user');
    }
    return res.redirect('http://localhost:3010');
  }
}
