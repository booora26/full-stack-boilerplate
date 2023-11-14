import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../crud/crud.service';
import { ShiftEntity } from './shift.entity';

@Injectable()
export class ShiftsService extends CrudService<ShiftEntity> {
  constructor(
    @InjectRepository(ShiftEntity)
    protected repo: Repository<ShiftEntity>,
    protected eventEmmiter: EventEmitter2,
  ) {
    super(repo, eventEmmiter);
  }

  async getShiftsByShop(shopId: number) {
    const shifts = await this.repo
      .createQueryBuilder('shifts')
      .where('shifts.shopId = :shopId', { shopId })
      .getMany();

    return shifts;
  }
}
