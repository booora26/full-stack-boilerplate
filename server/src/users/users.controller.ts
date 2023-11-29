import {
  Controller,
  Get,
  Param,
  Session,
  Response,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CrudController } from '../crud/crud.controller';
import { UserEntity } from './entities/user.entity';
import { ImpersonateGuard } from '../auth/guard/impersonate.guard';

@Controller('users')
export class UsersController extends CrudController<UserEntity> {
  constructor(protected readonly service: UsersService) {
    super(service);
  }

  @UseGuards(ImpersonateGuard)
  @Get(':id/impersonate')
  async impersonate(@Response() res) {
    // const user = await this.service.findOne(id);
    // if (!user) {
    //   throw new NotFoundException();
    // }
    // session.originalUser = session.passport.user;
    // session.passport.user = user;
    // await (session.originalUser = req.originalUser);

    res.redirect('/');
  }

  @Get('test2fa')
  async test2FA(@Req() req) {
    console.log('user req', req);
    return '2fa is working';
  }
}
