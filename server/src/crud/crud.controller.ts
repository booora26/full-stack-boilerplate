import {
  BadGatewayException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HostParam,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
  Headers,
  Req,
  Res,
} from '@nestjs/common';
import { CrudEntity } from './crud.entity';
import { CrudService } from './crud.service';
import { Public } from '../auth/decotators/public.decorator';
import { Response } from 'express';

@Controller()
export class CrudController<T extends CrudEntity> {
  constructor(protected readonly service: CrudService<T>) {}

  @Post()
  async create(
    @Body() createBaseDto: T,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.service.create(createBaseDto);
      const location = req.url;
      res.set('Location', `${location}/${result.id}`);
      return result;
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Get()
  async findAll(@Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      console.log('url', req.headers);

      const result = await this.service.findAll(req);

      const data = result[0];
      const count = result[1];

      console.log('broj', count);
      const currentPageURI = `${req.protocol}://${req.headers.host}${req.url}`;
      const { page, limit } = req.query;
      const nextPage = Number(page) + 1;
      const previousPage = Number(page) - 1;
      const lastPage = Number((count / limit).toFixed(0));

      const nextPageURI = currentPageURI.replace(
        `page=${page}`,
        `page=${nextPage}`,
      );
      console.log('next', nextPageURI, nextPage, currentPageURI);
      const previousPageURI = currentPageURI.replace(
        `page=${page}`,
        `page=${previousPage}`,
      );
      const lastPageURI = currentPageURI.replace(
        `page=${page}`,
        `page=${lastPage}`,
      );
      const firstPageURI = currentPageURI.replace(`page=${page}`, `page=1`);

      const headerLinks = [
        `<${firstPageURI}>;rel=first`,
        `<${lastPageURI}>;rel=last`,
      ];

      nextPage < lastPage ? headerLinks.push(`<${nextPageURI}>;rel=next`) : '';
      previousPage > 0 ? headerLinks.push(`<${previousPageURI}>;rel=prev`) : '';

      res.header({
        Link: headerLinks.join(','),
        // Link: `<${nextPageURI}>;rel=next,<${previousPageURI}>;rel=prev,<${lastPageURI}>;rel=last,<${firstPageURI}>;rel=first`,
        'Pagination-Count': lastPage > 0 ? lastPage : 1,
        'Pagination-Page': page,
        'Pagination-Limit': limit,
        'X-Total-Count': count,
      });

      return data;
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('active')
  async findActive(
    @Query('fields') fields?: string,
    @Query('skip') skip?: number | null,
    @Query('take') take?: number | null,
    @Query('relations') relations?: string[],
  ) {
    try {
      const selectedFields = fields.split(',');
      return await this.service.findActive(
        selectedFields,
        skip,
        take,
        relations,
      );
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    try {
      return await this.service.findOne(+id);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBaseDto: T) {
    try {
      return await this.service.update(+id, updateBaseDto);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }
  @Put(':id')
  async update2(@Param('id') id: string, @Body() updateBaseDto: T) {
    try {
      return await this.service.update2(+id, updateBaseDto);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @Post(':id/soft-remove')
  async softRemove(@Param('id') id: string) {
    try {
      return await this.service.softRemove(+id);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    try {
      return await this.service.restore(+id);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.service.remove(+id);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }
}
