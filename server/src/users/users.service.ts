import { Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService extends CrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repo: Repository<UserEntity>,
    eventEmitter: EventEmitter2,
  ) {
    super(repo, eventEmitter);
  }
}
