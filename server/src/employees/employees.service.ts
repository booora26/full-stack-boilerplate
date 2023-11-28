import { Injectable } from '@nestjs/common';
import { EmployeeEntity } from './employee.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../crud/crud.service';

@Injectable()
export class EmployeesService extends CrudService<EmployeeEntity> {
  constructor(
    @InjectRepository(EmployeeEntity)
    protected repo: Repository<EmployeeEntity>,
    protected eventEmmiter: EventEmitter2,
  ) {
    super(repo, eventEmmiter);
  }

  async findByEmail(email: string): Promise<EmployeeEntity> {
    console.log('3.1 - employees service findByEmail', email);
    const employee = await this.repo.findOne({ where: { email: email } });
    console.log('3.2 - employees service findByEmail', employee);
    return employee;
  }
}
