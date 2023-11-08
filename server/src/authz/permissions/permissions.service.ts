import { Injectable } from '@nestjs/common';
import { PermissionEntity } from './permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CrudService } from '../../crud/crud.service';

@Injectable()
export class PermissionsService extends CrudService<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    protected repo: Repository<PermissionEntity>,
    eventEmitter: EventEmitter2,
  ) {
    super(repo, eventEmitter);
  }
}
