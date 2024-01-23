import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
  Req,
  Res,
} from '@nestjs/common';
import { CrudEntity } from './crud.entity';
import { CrudService } from './crud.service';
import { Public } from '../auth/decotators/public.decorator';
import { Request, Response } from 'express';
import {
  generateLocationHeader,
  generatePagnationHeaders,
} from './helpers/header.helpers';

@Controller()
export class CrudController<T extends CrudEntity> {
  constructor(protected readonly service: CrudService<T>) {}

  @Post()
  async create(
    @Body() createBaseDto: T,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newItem = await this.service.create(createBaseDto);
    const { id } = newItem;
    const linkHeader = generateLocationHeader(req.url, id);
    res.set(linkHeader);
    return id;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Get()
  async findAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.service.findAll(req);

    const items = result[0];
    const itemsCount = result[1];

    if (itemsCount === 0) {
      res.status(204);
      return;
    }

    const { protocol, headers, originalUrl } = req;
    const currentPageURI = `${protocol}://${headers.host}${originalUrl}`;
    const { page, limit } = req.query;

    let pagnationHeader = {};
    pagnationHeader = generatePagnationHeaders(
      currentPageURI,
      page as string,
      limit as string,
      itemsCount,
    );

    res.header(pagnationHeader);

    // console.log('items', items);

    return items;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('active')
  async findActive(
    @Query('fields') fields?: string,
    @Query('skip') skip?: number | null,
    @Query('take') take?: number | null,
    @Query('relations') relations?: string[],
  ) {
    const selectedFields = fields.split(',');
    return await this.service.findActive(selectedFields, skip, take, relations);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBaseDto: T) {
    return await this.service.update(+id, updateBaseDto);
  }
  @Put(':id')
  async update2(
    @Param('id') id: string,
    @Body() updateBaseDto: T,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const item = await this.service.update2(+id, updateBaseDto);
    if (typeof item === 'number') {
      const { url, params } = req;
      const newItemURL = `${url}`.replace(`/${params.id}`, '');
      const linkHeader = generateLocationHeader(newItemURL, item);
      res.set(linkHeader);

      res.status(201);
      return item;
    }
    return item;
  }

  @Post(':id/soft-remove')
  async softRemove(@Param('id') id: string) {
    return await this.service.softRemove(+id);
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    return await this.service.restore(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
