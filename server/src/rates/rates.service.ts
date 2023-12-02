import { Injectable } from '@nestjs/common';
import { RateEntity } from './rate.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CrudService } from '../crud/crud.service';

@Injectable()
export class RatesService extends CrudService<RateEntity> {
  constructor(
    @InjectRepository(RateEntity)
    protected repo: Repository<RateEntity>,
    protected eventEmmiter: EventEmitter2,
  ) {
    super(repo, eventEmmiter);
  }

  async findLatestRate(
    employeeId: number,
    shopId: number,
    date: Date,
  ): Promise<RateEntity> {
    let rate = await this.repo.findOne({
      where: {
        employee: { id: employeeId },
        validFrom: LessThanOrEqual(date),
      },
      order: {
        validFrom: 'DESC',
      },
    });

    if (!rate) {
      rate = await this.repo.findOne({
        where: {
          shop: { id: shopId },
          employee: null,
          validFrom: LessThanOrEqual(date),
        },
        order: {
          validFrom: 'DESC',
        },
      });
    }

    console.log('rate', rate, date, employeeId, shopId);

    return rate;
  }
}
