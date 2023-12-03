import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeEntity } from './employee.entity';
import { CrudController } from '../crud/crud.controller';
import { ParseIntPipe } from '@nestjs/common';


@Controller('employees')
export class EmployeesController extends CrudController<EmployeeEntity> {
  constructor(protected readonly service: EmployeesService) {
    super(service);
  }



@Get(':id/services')
async getEmployeeServicesWithRates(
  @Param('id', ParseIntPipe) employeeId: number,
  @Body() body: { shopId: number, date: string }
) {
  if (!employeeId || !body.shopId || !body.date) {
    throw new BadRequestException(
      'employeeId, shopId, and date are required',
    );
  }

  const parsedDate = new Date(body.date);
  if (isNaN(parsedDate.getTime())) {
    throw new BadRequestException('Invalid date format');
  }

  return this.service.getEmployeeServicesWithRates(employeeId, body.shopId, parsedDate);
}
}
