import { Injectable } from '@nestjs/common';
import { ShopEntity } from './shop.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { CrudService } from '../crud/crud.service';

@Injectable()
export class ShopService extends CrudService<ShopEntity> {
  constructor(
    @InjectRepository(ShopEntity)
    protected repo: Repository<ShopEntity>,
    protected eventEmmiter: EventEmitter2,
  ) {
    super(repo, eventEmmiter);
  }

  async search(keyword: string) {
    const query = this.repo.createQueryBuilder('shop');

    console.log('shop', this.metadata.relationIds);

    query
      .where({ name: ILike(`%${keyword}%`) })
      .orWhere({ displayName: ILike(`%${keyword}%`) });

    query.select(['shop.id', 'shop.name']);

    return await query.getMany();
  }
}
