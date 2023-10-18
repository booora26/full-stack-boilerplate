import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('3 - auth service ValidateUser');

    const user = await this.usersService.findByEmail(email);
    if (user && user.validatePassword(password)) {
      const { password, salt, ...result } = user;
      return result;
    }
    return null;
  }

  async logOut(req, res) {
    req.logOut(function (err) {
      if (err) {
        return err;
      }
      res.send('you are logout');
    });
    // req.session.cookie.maxAge = 0;
    req.session.destroy;
  }
}
