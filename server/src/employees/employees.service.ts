import { Injectable } from '@nestjs/common';
import { EmployeeEntity } from './employee.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../crud/crud.service';
import { ServicesService } from '../services/services.service';
import { RatesService } from '../rates/rates.service';
import { ServiceEntity } from '../services/service.entity';

@Injectable()
export class EmployeesService extends CrudService<EmployeeEntity> {
  constructor(
    @InjectRepository(EmployeeEntity)
    protected repo: Repository<EmployeeEntity>,
    protected eventEmmiter: EventEmitter2,
    private ratesService: RatesService,
  ) {
    super(repo, eventEmmiter);
  }

  async findByEmail(email: string): Promise<EmployeeEntity> {
    console.log('3.1 - employees service findByEmail', email);
    const employee = await this.repo.findOne({ where: { email: email } });
    console.log('3.2 - employees service findByEmail', employee);
    return employee;
  }

  async getEmployeeServicesWithRates(employeeId: number, shopId: number, date: Date): Promise<any> {
    const rates = await this.ratesService.findRate(date, employeeId, shopId);

    const employee = await this.repo.findOne({ where: { id: employeeId }, relations: ['services'] });

    if (!employee) {
      throw new Error('Employee not found');
    }

    console.log('serv', employee.services, rates);

    const serviceRates = employee.services.map(service => ({
      serviceName: service.name,
      rate: rates.prices.find(rate => rate.serviceId === service.id)?.value,
      currency: rates.currency
    }));

    const rateType = rates.employeeId ? 'employee' : 'shop';

    return {employeeName: employee.name, validFrom: rates.validFrom, rateType, serviceRates};
  }


}
