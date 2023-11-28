import { Injectable } from '@nestjs/common';
import { RateEntity } from './rate.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
