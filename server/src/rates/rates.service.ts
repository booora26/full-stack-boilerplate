import { Injectable } from '@nestjs/common';
import { RateEntity } from './rate.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository, Brackets } from 'typeorm';
import { CrudService } from '../crud/crud.service';
import { ServiceEntity } from '../services/service.entity';

@Injectable()
export class RatesService extends CrudService<RateEntity> {
  constructor(
    @InjectRepository(RateEntity)
    protected repo: Repository<RateEntity>,
    protected eventEmmiter: EventEmitter2,
  ) {
    super(repo, eventEmmiter);
  }
  async findRate(date: Date, employeeId: number, shopId: number): Promise<any> {
    try {
      let rate = await this.repo
        .createQueryBuilder('rate')
        .select(['rate.employeeId', 'rate.validFrom', 'rate.currency', 'rate.prices'])
        .where('rate.validFrom <= :date', { date })
        .andWhere(new Brackets(qb => {
          qb.where('rate.employeeId = :employeeId', { employeeId })
            .orWhere('rate.employeeId IS NULL AND rate.shopId = :shopId', { shopId });
        }))
        .orderBy({
          'rate.employeeId': 'ASC', // null values will be at the end
          'rate.validFrom': 'DESC'
        })
        .getOne();

      if (!rate) {
        throw new Error('Rate not found');
      }

      return rate;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  }

