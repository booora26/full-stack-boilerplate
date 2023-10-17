import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CrudController } from '../crud/crud.controller';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController extends CrudController<UserEntity> {
  constructor(service: UsersService) {
    super(service);
  }
}
