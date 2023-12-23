import { Body, Controller, Get, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CrudController } from '../crud/crud.controller';
import { AppointmentEntity } from './appointment.entity';
import { ShopEntity } from '../shop/shop.entity';
import { EmployeeEntity } from '../employees/employee.entity';
import { ServiceEntity } from '../services/service.entity';

@Controller('appointment')
export class AppointmentController extends CrudController<AppointmentEntity> {
  constructor(protected readonly service: AppointmentService) {
    super(service);
  }

  @Post('free-by-emp')
  async freeSlotsByEmployee(
    @Body('shop') shop: ShopEntity,
    @Body('employee') employee: EmployeeEntity,
    @Body('date') date: Date,
    @Body('service') service: ServiceEntity,
  ) {

    console.log(shop, employee, date, service);
    const freeSlots = await this.service.freeSlotsByEmployee(
      shop.id,
      employee.id,
      date,
      service.id,
    );

    return freeSlots;
  }
  @Get('free-by-time')
  async freeSlotsByTime(
    @Body('shopId') shopId: number,
    @Body('slot') slot: string,
    @Body('date') date: Date,
  ) {
    const freeSlots = await this.service.getAvailableSlotsByTime(
      shopId,
      slot,
      date,
    );

    return freeSlots;
  }
  @Get('booked-by-emp')
  async bookedSlotsByEmployee(
    @Body('shopId') shopId: number,
    @Body('employeeId') employeeId: number,
    @Body('date') date: Date,
  ) {
    const bookedSlots = await this.service.getBookedSlotsByEmployee(
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
    @Body('user') user,
    @Body('service') service,
  ) {
    const res = this.service.bookFreeSlots(id, serviceSlots, user, service);

    return res;
  }
}
