import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';

@Injectable()
export class TwoFAGuard extends AuthGuard('TwoFA') {
  constructor(private usersService: UsersService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check the email and the password
    console.log('1 - 2FA pre canActivate');

    const request = await context.switchToHttp().getRequest();

    const { user } = request;

    console.log('2fa guard', request.user);

    const { email, password } = user;

    request.body = { ...request.body, email, password };

    await super.canActivate(context);

    console.log('4 - 2FA posle canActivate');

    // initialize the session
    console.log('5 - 2FA pre logIn');

    await super.logIn(request);
    console.log('7 - 2FA posle logIn');

    // if no exceptions were thrown, allow the access to the route
    return true;
  }
}
