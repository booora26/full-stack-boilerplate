import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateEntity } from './rate.entity';
import { ServiceEntity } from '../services/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RateEntity, ServiceEntity])],
  controllers: [RatesController],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
