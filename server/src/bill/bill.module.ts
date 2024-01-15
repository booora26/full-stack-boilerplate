import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillEntity } from './bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillEntity])],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
