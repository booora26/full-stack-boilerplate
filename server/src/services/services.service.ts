import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
