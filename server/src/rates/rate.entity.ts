import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { CurrencyEnum } from './currency.enum';
import { ShopEntity } from '../shop/shop.entity';
import { EmployeeEntity } from '../employees/employee.entity';

interface Price {
  value: number;
  serviceId: number;
}

@Entity({ name: 'rates' })
export class RateEntity extends CrudEntity {
  @Column({type: 'jsonb', nullable: true})
  prices: Price[];

  @Column({ type: 'enum', enum: CurrencyEnum, default: CurrencyEnum.RSD })
  currency: CurrencyEnum;
  @Column({name: 'valid_from'})
  validFrom: Date;
  @ManyToOne(() => EmployeeEntity, (employee) => employee.rates)
  employee: EmployeeEntity;
  @Column({nullable: true})
  employeeId?: number;
  @ManyToOne(() => ShopEntity, (shop) => shop.rates)
  shop: ShopEntity;
}
