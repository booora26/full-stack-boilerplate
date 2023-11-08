import { Controller } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CrudController } from '../../crud/crud.controller';
import { PermissionEntity } from './permission.entity';

@Controller()
export class PermissionsController extends CrudController<PermissionEntity> {
  constructor(protected readonly service: PermissionsService) {
    super(service);
  }
}
