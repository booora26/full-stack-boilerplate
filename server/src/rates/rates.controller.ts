import { BadRequestException, Body, Controller, Get, Query } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RateEntity } from './rate.entity';
import { CrudController } from '../crud/crud.controller';

@Controller('rates')
export class RatesController extends CrudController<RateEntity> {
  constructor(protected readonly service: RatesService) {
    super(service);
  }

  @Get('latest-rate')
  async findLatestRate(
    @Body('employeeId') employeeId: number,
    @Body('shopId') shopId: number,
    @Body('validFrom') date: string,
  ) {
    if (!employeeId || !shopId || !date) {
      throw new BadRequestException(
        'employeeId, shopId, and validFrom are required',
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.service.findLatestRate(employeeId, shopId, parsedDate);
  }
}
