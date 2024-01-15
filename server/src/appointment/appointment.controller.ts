import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CrudController } from '../crud/crud.controller';
import { AppointmentEntity } from './appointment.entity';
import { ShopEntity } from '../shop/shop.entity';
import { EmployeeEntity } from '../employees/employee.entity';
import { ServiceEntity } from '../services/service.entity';
import { UserEntity } from '../users/entities/user.entity';
import { Public } from '../auth/decotators/public.decorator';

@Controller('appointment')
export class AppointmentController extends CrudController<AppointmentEntity> {
  constructor(protected readonly service: AppointmentService) {
    super(service);
  }

  @Public()
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

    console.log('freeSlots', freeSlots);

    return freeSlots;
  }
  @Public()
  @Post('free-by-time')
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
  @Post('booked-by-emp')
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

  @Post('generate')
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
  @Patch('bookV2')
  async bookFreeSlotsV2(
    @Req() req,
    @Query('id', ParseIntPipe) id: number,
    @Query('serviceSlots', ParseIntPipe) serviceSlots: number,
    // @Query('userId') userId,
    @Query('serviceId') serviceId,
  ) {
    // const user = new UserEntity();
    const user = req.user;
    console.log('user', user);
    // user.id = userId;
    const service = new ServiceEntity();
    service.id = serviceId;
    const res = this.service.bookFreeSlots(id, serviceSlots, user, service);

    return res;
  }
}
