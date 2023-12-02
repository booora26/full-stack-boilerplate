import {
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ImpersonateGuard extends AuthGuard('impersonate') {
  constructor(private userService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('1 - ImpersonateAuthGuard pre canActivate');

      const request = context.switchToHttp().getRequest();

      console.log('original user', request.session.passport.user);

      request.originalUser =
        request.session.passport.user.originalUser ||
        request.session.passport.user;

      const id = request.params.id;
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException();
      }

      const { email, password } = user;
      request.body = { email, password, provider: 'impersonate' };

      await super.canActivate(context);

      console.log('4 - ImpersonateGuard posle canActivate');

      console.log('5 - ImpersonateGuard pre logIn');
      await super.logIn(request);

      console.log('7 -ImpersonateGuard  posle logIn');

      return true;
    } catch (error) {
      console.error('Error in canActivate:', error);
      throw error;
    }
  }
}
