import { Controller, Get, Param } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ShiftEntity } from './shift.entity';
import { CrudController } from '../crud/crud.controller';

@Controller('shifts')
export class ShiftsController extends CrudController<ShiftEntity> {
  constructor(protected readonly service: ShiftsService) {
    super(service);
  }

  @Get('by-shop/:shopId')
  async getShiftsByShop(@Param('shopId') shopId: number) {
    const shifts = await this.service.getShiftsByShop(shopId);
    return shifts;
  }
}
