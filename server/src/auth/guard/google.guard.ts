import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check the email and the password
    console.log('1 - LocalAuthGuard pre canActivate');

    await super.canActivate(context);

    console.log('4 - LocalAuthGuard posle canActivate');

    // initialize the session
    const request = await context.switchToHttp().getRequest();
    console.log('5 - LocalAuthGuard pre logIn');

    await super.logIn(request);
    console.log('7 - LocalAuthGuard posle logIn');

    // if no exceptions were thrown, allow the access to the route
    return true;
  }
}
