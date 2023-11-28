import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftEntity } from './shift.entity';
import { ShiftMiddleware } from './middlewars/shift/shift.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([ShiftEntity])],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService],
})
export class ShiftsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ShiftMiddleware).forRoutes(ShiftsController);
  }
}
