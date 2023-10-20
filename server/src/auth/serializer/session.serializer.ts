import { PassportSerializer } from '@nestjs/passport';
import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }
  async serializeUser(user: any, done?: CallableFunction) {
    console.log('6 - serialize', user);
    const { id, email, originalUser } = user;
    done(null, { id, email, originalUser });
  }
  async deserializeUser(user: UserEntity, done: CallableFunction) {
    console.log('deserialize', user);

    user ? done(null, user) : done(null, null);
  }
}
