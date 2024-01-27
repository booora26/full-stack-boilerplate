import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { EmployeesService } from './employees.service';
import { EmployeeEntity } from './employee.entity';
import { CrudController } from '../crud/crud.controller';
import { ParseIntPipe } from '@nestjs/common';

@Controller('employees')
export class EmployeesController extends CrudController<EmployeeEntity> {
  constructor(protected readonly service: EmployeesService) {
    super(service);
  }

  @Post(':id/services')
  async getEmployeeServicesWithRates(
    @Param('id', ParseIntPipe) employeeId: number,
    @Body('date') date: string,
  ) {
    try {
      if (!employeeId || !date) {
        throw new BadRequestException('employeeId and date are required');
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      return await this.service.getEmployeeServicesWithRates(
        employeeId,
        parsedDate,
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'An error occurred while getting services with rates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
