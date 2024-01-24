import {
  Controller,
  Get,
  Param,
  Inject,
  Body,
  Patch,
  Headers,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ShopService } from './shop.service';
import { ShopEntity } from './shop.entity';
import { CrudController } from '../crud/crud.controller';
import { Request, Response } from 'express';
import { Public } from '../auth/decotators/public.decorator';

@Controller('shop')
export class ShopController extends CrudController<ShopEntity> {
  constructor(
    protected readonly service: ShopService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(service);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string, @Query() query): Promise<ShopEntity> {
    const cacheKey = `shop_${id}`;
    let shop: ShopEntity = await this.cacheManager.get(cacheKey);
    if (!shop) {
      shop = await this.service.findOne(+id, query);
      await this.cacheManager.set(cacheKey, shop);
    }
    return shop; // Fix: Return the 'shop' object
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShopDto: any,
  ): Promise<ShopEntity> {
    const updatedShop = await this.service.update(+id, updateShopDto);
    const cacheKey = `shop_${id}`;
    await this.cacheManager.del(cacheKey);
    return updatedShop;
  }

  @Get('search/:keyword')
  async search(@Param('keyword') keyword: string) {
    return await this.service.search(keyword);
  }
}
