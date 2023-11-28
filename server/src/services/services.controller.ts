import { Controller } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServiceEntity } from './service.entity';
import { CrudController } from '../crud/crud.controller';

@Controller('services')
export class ServicesController extends CrudController<ServiceEntity> {
  constructor(protected readonly service: ServicesService) {
    super(service);
  }
}
