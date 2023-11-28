import { Controller } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopEntity } from './shop.entity';
import { CrudController } from '../crud/crud.controller';

@Controller('shop')
export class ShopController extends CrudController<ShopEntity> {
  constructor(protected readonly service: ShopService) {
    super(service);
  }
}
