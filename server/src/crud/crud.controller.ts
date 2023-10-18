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
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CrudEntity } from './crud.entity';
import { CrudService } from './crud.service';

@Controller()
export class CrudController<T extends CrudEntity> {
  constructor(private readonly service: CrudService<T>) {}

  @Post()
  async create(@Body() createBaseDto: T) {
    try {
      return await this.service.create(createBaseDto);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  // @UseGuards(DinamicPermissionGuard)
  async findAll(
    @Query('skip') skip?: number | null,
    @Query('take') take?: number | null,
    @Query('relations') relations?: string[],
  ) {
    try {
      return await this.service.findAll(skip, take, relations);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('active')
  // @UseGuards(DinamicPermissionGuard)
  async findActive(
    @Query('skip') skip?: number | null,
    @Query('take') take?: number | null,
    @Query('relations') relations?: string[],
  ) {
    try {
      return await this.service.findActive(skip, take, relations);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @Get(':id')
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

  @Delete(':id')
  async softRemove(@Param('id') id: string) {
    try {
      return await this.service.softRemove(+id);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @Post(':id')
  async restore(@Param('id') id: string) {
    try {
      return await this.service.restore(+id);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }

  @Delete(':id/hard')
  async remove(@Param('id') id: string) {
    try {
      return await this.service.remove(+id);
    } catch (err) {
      throw new BadGatewayException(err);
    }
  }
}
