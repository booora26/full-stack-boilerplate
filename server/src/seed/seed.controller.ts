import { Controller, Get, Param } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('user')
  async seedUser() {
    return await this.seedService.seedUser();
  }
  @Get('users/:numberOfUsers')
  async seedUsers(@Param('numberOfUsers') numberOfUsers: number) {
    return await this.seedService.seedUsers(numberOfUsers);
  }

  // controller for generating shops
  @Get('shop')
  async seedShop() {
    return await this.seedService.seedShop();
  }
  @Get('shops/:numberOfShops')
  async seedShops(@Param('numberOfShops') numberOfShops: number) {
    return await this.seedService.seedShops(numberOfShops);
  }
}
