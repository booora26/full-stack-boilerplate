import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateEntity } from './rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RateEntity])],
  controllers: [RatesController],
  providers: [RatesService],
})
export class RatesModule {}
