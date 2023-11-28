import { Controller } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RateEntity } from './rate.entity';
import { CrudController } from '../crud/crud.controller';

@Controller('rates')
export class RatesController extends CrudController<RateEntity> {
  constructor(protected readonly service: RatesService) {
    super(service);
  }
}
