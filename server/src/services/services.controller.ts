import { Controller, Post, Body } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServiceEntity } from './service.entity';
import { CrudController } from '../crud/crud.controller';

@Controller('services')
export class ServicesController extends CrudController<ServiceEntity> {
  constructor(protected readonly service: ServicesService) {
    super(service);
  }

  @Post('last-rate')
  async findLastRateByDate(
    @Body() body: { date: Date; employeeId?: number; shopId?: number },
  ) {
    const { date, employeeId, shopId } = body;
    return this.service.findLastRateByDate(date, employeeId, shopId);
  }
}
