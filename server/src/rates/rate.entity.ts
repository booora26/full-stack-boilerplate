import { Column, Entity, ManyToOne } from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { CurrencyEnum } from './currency.enum';
import { ServiceEntity } from '../services/service.entity';
import { ShopEntity } from '../shop/shop.entity';
import { EmployeeEntity } from '../employees/employee.entity';

@Entity({ name: 'rates' })
export class RateEntity extends CrudEntity {
  @Column()
  value: number;
  @Column({ type: 'enum', enum: CurrencyEnum, default: CurrencyEnum.RSD })
  currency: CurrencyEnum;
  @Column()
  validFrom: Date;
  @ManyToOne(() => ServiceEntity, (service) => service.rates, { eager: true })
  service: ServiceEntity;
  @ManyToOne(() => EmployeeEntity, (employee) => employee.rates)
  employee: EmployeeEntity;
  @ManyToOne(() => ShopEntity, (shop) => shop.rates)
  shop: ShopEntity;
}
