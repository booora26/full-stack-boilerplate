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


  @Get('search/:keyword')
  async search(@Param('keyword') keyword: string) {
    return await this.service.search(keyword);
  }
}
