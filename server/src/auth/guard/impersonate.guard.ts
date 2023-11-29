import {
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ImpersonateGuard extends AuthGuard('impersonate') {
  constructor(private userService: UsersService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check the email and the password
    console.log('1 - ImpersonateAuthGuard pre canActivate');

    const request = await context.switchToHttp().getRequest();

    console.log('original user', request.session.passport.user);

    request.session.passport.user.originalUser
      ? (request.originalUser = request.session.passport.user.originalUser)
      : (request.originalUser = request.session.passport.user);

    // request.originalUser = originalUser;

    const id = request.params.id;
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }

    const { email, password } = user;
    request.body = { email, password, provider: 'impersonate' };

    await super.canActivate(context);

    console.log('4 - ImpersonateGuard posle canActivate');

    // initialize the session
    console.log('5 - ImpersonateGuard pre logIn');
    // const request = await context.switchToHttp().getRequest();

    await super.logIn(request);

    console.log('7 -ImpersonateGuard  posle logIn');

    // if no exceptions were thrown, allow the access to the route
    return true;
  }
}
