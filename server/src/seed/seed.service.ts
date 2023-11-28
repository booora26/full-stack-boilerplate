import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { faker } from '@faker-js/faker';
import { UserEntity } from '../users/entities/user.entity';
import { RolesService } from '../authz/roles/roles.service';
import { ShopEntity } from '../shop/shop.entity';
import { UserRole } from '../users/user-roles.enum';

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
    // const roles = await this.rolesService.findAll();
    const roles = [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.USER];
    // const externalProviders = ['local', 'google', 'github'];
    const newUser = new UserEntity();
    newUser.email = faker.internet.email().toLocaleLowerCase();
    newUser.image = faker.internet.avatar();
    newUser.password = '123';
    // newUser.roles = faker.helpers.arrayElements(roles, { min: 1, max: 2 });
    newUser.role = faker.helpers.arrayElement(roles);
    return await this.usersService.create(newUser);
  }

  // write seed function for generating shops and employees
  async seedShops(numberOfShops: number) {
    const shops = [];
    for (let i = 0; i < numberOfShops; i++) {
      const shop = await this.seedShop();
      shops.push(shop);
    }
    return shops;
  }

  async seedShop() {
    const newShop = new ShopEntity();
    newShop.name = faker.company.name();
    newShop.displayName = faker.company.name();
    newShop.country = faker.location.country();
    newShop.city = faker.location.city();
    newShop.address = faker.location.streetAddress();
    return newShop;
  }
}
