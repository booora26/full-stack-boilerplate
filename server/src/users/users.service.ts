import { Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService extends CrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repo: Repository<UserEntity>,
    eventEmitter: EventEmitter2,
  ) {
    super(repo, eventEmitter);
  }

  async findByEmail(email: string) {
    try {
      return await this.repo.findOne({ where: { email: email } });
    } catch (err) {
      throw new Error(err);
    }
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.repo.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.repo.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }
}
