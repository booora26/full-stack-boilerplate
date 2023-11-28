import { Controller } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeEntity } from './employee.entity';
import { CrudController } from '../crud/crud.controller';

@Controller('employees')
export class EmployeesController extends CrudController<EmployeeEntity> {
  constructor(protected readonly service: EmployeesService) {
    super(service);
  }
}
