import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
  @Post()
  async createShift(@Body() shiftData: Partial<ShiftEntity>, @Query() query) {
    const shift = await this.service.createShift(shiftData, query);
    return shift;
  }

  @Patch(':id')
  async updateShift(
    @Param('id') id: number,
    @Body() shiftData: Partial<ShiftEntity>,
    @Query() query,
  ) {
    if (!shiftData.shop || !shiftData.shop.id) {
      throw new BadRequestException('Shop is missing in request body');
    }

    const shift = await this.service.updateShift(id, shiftData, query);
    return shift;
  }
}
