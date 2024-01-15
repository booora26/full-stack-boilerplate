import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post()
  create(@Body() createSlotDto: CreateSlotDto) {
    return this.slotService.create(createSlotDto);
  }
  @Post(':id/soft-remove')
  softRemove(@Param('id') id: string) {
    return this.slotService.softRemove(+id);
  }

  @Get()
  findAll(@Query('fields') fields: string) {
    return this.slotService.findAll(fields);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSlotDto: UpdateSlotDto) {
    return this.slotService.update(+id, updateSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slotService.remove(+id);
  }
}
