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
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController extends CrudController<UserEntity> {
  constructor(
    protected readonly service: UsersService,
    protected readonly configService: ConfigService,
  ) {
    super(service);
  }

  clientURL =
    this.configService.get('NODE_ENV') === 'DEVELOPMENT'
      ? this.configService.get('CLIENT_DEV_URL')
      : this.configService.get('CLIENT_PROD_URL');

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

    res.redirect(`${this.clientURL}/`);
  }

  @Get('test2fa')
  async test2FA(@Req() req) {
    console.log('user req', req);
    return '2fa is working';
  }
}
