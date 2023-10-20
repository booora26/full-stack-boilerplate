import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Session,
  Response,
  Request,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CrudController } from '../crud/crud.controller';
import { UserEntity } from './entities/user.entity';
import { LocalAuthGuard } from '../auth/guard/local-auth.guard';
import { GoogleGuard } from '../auth/guard/google.guard';
import { Provider } from '../auth/decotators/provider.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ImpersonateGuard } from '../auth/guard/impersonate.guard';
import { session } from 'passport';

@Controller('users')
export class UsersController extends CrudController<UserEntity> {
  constructor(protected readonly service: UsersService) {
    super(service);
  }

  @UseGuards(ImpersonateGuard)
  @Get(':id/impersonate')
  async impersonate(
    @Param('id') id: number,
    @Response() res,
    @Request() req,
    @Session() session,
  ) {
    // const user = await this.service.findOne(id);
    // if (!user) {
    //   throw new NotFoundException();
    // }
    // session.originalUser = session.passport.user;
    // session.passport.user = user;
    // await (session.originalUser = req.originalUser);
    res.redirect('http://localhost:3010');
  }
}
