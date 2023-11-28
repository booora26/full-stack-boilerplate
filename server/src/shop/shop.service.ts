import { Injectable } from '@nestjs/common';
import { ShopEntity } from './shop.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
