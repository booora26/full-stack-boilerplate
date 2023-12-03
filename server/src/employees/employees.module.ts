import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './employee.entity';
import { RatesModule } from '../rates/rates.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity]), RatesModule ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
