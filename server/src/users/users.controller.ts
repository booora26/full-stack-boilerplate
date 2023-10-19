import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Session,
  Response,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CrudController } from '../crud/crud.controller';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController extends CrudController<UserEntity> {
  constructor(protected readonly service: UsersService) {
    super(service);
  }

  @Get(':id/impersonate')
  async impersonate(
    @Param('id') id: number,
    @Session() session,
    @Response() res,
  ) {
    const user = await this.service.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    session.originalUser = session.passport.user;
    session.passport.user = user;
    res.redirect('http://localhost:3010');
  }
}
