import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { faker } from '@faker-js/faker';
import { UserEntity } from '../users/entities/user.entity';
import { RolesService } from '../authz/roles/roles.service';

@Injectable()
export class SeedService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
  ) {}

  async seedUsers(numberOfUsers: number) {
    const users = [];
    for (let i = 0; i < numberOfUsers; i++) {
      const user = await this.seedUser();
      users.push(user);
    }
    return users;
  }

  async seedUser() {
    const roles = await this.rolesService.findAll();
    // const externalProviders = ['local', 'google', 'github'];
    const newUser = new UserEntity();
    newUser.email = faker.internet.email().toLocaleLowerCase();
    newUser.image = faker.internet.avatar();
    newUser.password = '123';
    newUser.roles = faker.helpers.arrayElements(roles, { min: 1, max: 2 });
    return await this.usersService.create(newUser);
  }
}
