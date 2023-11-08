import { Controller } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CrudController } from '../../crud/crud.controller';
import { RoleEntity } from './role.entity';

@Controller()
export class RolesController extends CrudController<RoleEntity> {
  constructor(protected readonly service: RolesService) {
    super(service);
  }
}
