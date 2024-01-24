import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { CrudService } from '../crud/crud.service';
import { ShiftEntity } from './shift.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ShopService } from '../shop/shop.service';

@Injectable()
export class ShiftsService extends CrudService<ShiftEntity> {
  constructor(
    @InjectRepository(ShiftEntity)
    protected repo: Repository<ShiftEntity>,
    protected eventEmmiter: EventEmitter2,
    protected shopService: ShopService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async createShift(shiftData: Partial<ShiftEntity>, query) {
    const shop = await this.shopService.findOne(shiftData.shop.id, query);
    if (!shop) {
      throw new Error('Shop not found');
    }

    const shift = this.repo.create(shiftData);
    shift.shop = shop;

    // Fill slotDuration from shop
    shift.slotDuration = shop.slotDuration;

    return await this.repo.save(shift);
  }
  async updateShift(id: number, shiftData: Partial<ShiftEntity>, query) {
    const shop = await this.shopService.findOne(shiftData.shop.id, query);
    if (!shop) {
      throw new Error('Shop not found');
    }

    const shift = await this.repo.findOne({
      where: { id: Equal(id) },
    });
    if (!shift) {
      throw new Error('Shift not found');
    }

    // Update shift data
    Object.assign(shift, shiftData);

    // Fill slotDuration from shop
    shift.slotDuration = shop.slotDuration;

    return await this.repo.save(shift);
  }
}
