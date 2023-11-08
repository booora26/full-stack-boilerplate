import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../crud/crud.service';
import { RoleEntity } from './role.entity';

@Injectable()
export class RolesService extends CrudService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    protected repo: Repository<RoleEntity>,
    eventEmitter: EventEmitter2,
  ) {
    super(repo, eventEmitter);
  }
}
