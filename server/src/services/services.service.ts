import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { CrudService } from '../crud/crud.service';
import { ServiceEntity } from './service.entity';

@Injectable()
export class ServicesService extends CrudService<ServiceEntity> {
  constructor(
    @InjectRepository(ServiceEntity)
    protected repo: Repository<ServiceEntity>,
    protected eventEmmiter: EventEmitter2,
  ) {
    super(repo, eventEmmiter);
  }

  async findLastRateByDate(
    date: Date,
    employeeId?: number,
    shopId?: number,
  ): Promise<{ serviceName: string, serviceDuration: number, rate: number }[]> {
    const subQueryResults = await this.repo.createQueryBuilder('rate')
      .select('MAX(rate.validFrom)', 'max_valid_from') // Use 'rate' instead of 'rates'
      .addSelect('rate.serviceId', 'service_id')
      .where('rate.validFrom <= :date', { date })
      .andWhere('rate.employeeId = :employeeId OR rate.shopId = :shopId', { employeeId, shopId })
      .groupBy('rate.serviceId')
      .getRawMany();

    const subQuery = subQueryResults.map(result => `(${result.max_valid_from}, ${result.service_id})`).join(', ');

    const servicesAndRates = await this.repo.createQueryBuilder('service')
      .select('service.name', 'serviceName')
      .addSelect('service.duration', 'serviceDuration')
      .addSelect('rate.value', 'rate')
      .leftJoin('service.rates', 'rate')
      .innerJoin(`(${subQuery})`, 'sub', 'rate.serviceId = sub.serviceId AND rate.validFrom = sub.max_valid_from')
      .getRawMany();

    return servicesAndRates;
  }
}
