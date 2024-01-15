import {
  BadGatewayException,
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
  async findAll(
    @Query('fields') fields?: string | null,
    @Query('skip') skip?: number | null,
    @Query('take') take?: number | null,
    @Query('relations') relations?: string,
    @Query() filters?: Record<string, string>,
  ) {
    try {
      return await this.service.findAll(fields, skip, take, relations, filters);
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
