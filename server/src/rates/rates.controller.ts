import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RateEntity } from './rate.entity';
import { CrudController } from '../crud/crud.controller';

@Controller('rates')
export class RatesController extends CrudController<RateEntity> {
  constructor(protected readonly service: RatesService) {
    super(service);
  }

  @Post('find-rate')
  async findRate(@Body('date') date: Date, @Body('employeeId') employeeId: number, @Body('shopId') shopId: number) {
    return this.service.findRate(date, employeeId, shopId);
  }

}
