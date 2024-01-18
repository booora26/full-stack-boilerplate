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
} from '@nestjs/common';
import { CrudEntity } from './crud.entity';
import { CrudService } from './crud.service';
import { Public } from '../auth/decotators/public.decorator';

@Controller()
export class CrudController<T extends CrudEntity> {
  constructor(protected readonly service: CrudService<T>) {}

  @Post()
  async create(@Body() createBaseDto: T) {
    try {
      return await this.service.create(createBaseDto);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  @Get()
  async findAll(@Req() req) {
    try {
      console.log('url', req);

      const result = await this.service.findAll(req);

      const data = result[0];
      const count = result[1];

      console.log('broj', count);
      const currentPageURI = `${req.protocol}://${req.headers.host}${req.url}`;
      const { page, limit } = req.query;
      const nextPage = Number(page) + 1;
      const previousPage = Number(page) - 1;
      const lastPage = (count / limit).toFixed(0);

      const nextPageURI = currentPageURI.replace(
        `&page=${page}`,
        `&page=${nextPage}`,
      );
      const previousPageURI = currentPageURI.replace(
        `&page=${page}`,
        `&page=${previousPage}`,
      );
      const lastPageURI = currentPageURI.replace(
        `&page=${page}`,
        `&page=${lastPage}`,
      );

      return {
        data,
        pagnation: {
          next: nextPageURI,
          previous: previousPageURI,
          last: lastPageURI,
        },
      };
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
