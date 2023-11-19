import { Body, Controller, Get, ParseIntPipe, Patch } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CrudController } from '../crud/crud.controller';
import { AppointmentEntity } from './appointment.entity';

@Controller('appointment')
export class AppointmentController extends CrudController<AppointmentEntity> {
  constructor(protected readonly service: AppointmentService) {
    super(service);
  }

  @Get('free-by-emp')
  async freeSlotsByEmployee(
    @Body('shopId') shopId: number,
    @Body('employeeId') employeeId: number,
    @Body('date') date: Date,
    @Body('serviceId') serviceId: number,
  ) {
    const freeSlots = await this.service.freeSlotsByEmployee(
      shopId,
      employeeId,
      date,
      serviceId,
    );

    return freeSlots;
  }
  @Get('free-by-time')
  async freeSlotsByTime(
    @Body('shopId') shopId: number,
    @Body('slot') slot: string,
    @Body('date') date: Date,
  ) {
    const freeSlots = await this.service.freeSlotsByTime(shopId, slot, date);

    return freeSlots;
  }
  @Get('booked-by-emp')
  async bookedSlotsByEmployee(
    @Body('shopId') shopId: number,
    @Body('employeeId') employeeId: number,
    @Body('date') date: Date,
  ) {
    const bookedSlots = await this.service.bookedSlotsByEmployee(
      shopId,
      employeeId,
      date,
    );

    return bookedSlots;
  }

  @Get('generate')
  async generatAllSlots(@Body() schedule) {
    console.log(schedule);
    const allSlots = await this.service.generateAllSlots(schedule);

    return allSlots;
  }

  @Patch('book')
  async bookFreeSlots(
    @Body('id', ParseIntPipe) id: number,
    @Body('serviceSlots', ParseIntPipe) serviceSlots: number,
  ) {
    const res = this.service.bookFreeSlots(id, serviceSlots);

    return res;
  }
}
