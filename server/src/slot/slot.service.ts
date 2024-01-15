import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../crud/crud.service';
import { Slot } from './entities/slot.entity';

@Injectable()
export class SlotService extends CrudService<Slot> {
  constructor(
    @InjectRepository(Slot)
    protected repo: Repository<Slot>,
    protected eventEmmiter: EventEmitter2,
  ) {
    super(repo, eventEmmiter);
  }
}
