import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { ShopEntity } from '../shop/shop.entity';
import { RateEntity } from '../rates/rate.entity';
import { EmployeeEntity } from '../employees/employee.entity';

@Entity({ name: 'service' })
export class ServiceEntity extends CrudEntity {
  @Column()
  name: string;
  @Column()
  duration: number;
  @ManyToOne(() => ShopEntity, (shop) => shop.services)
  shop: ShopEntity;
  @OneToMany(() => RateEntity, (rates) => rates.service)
  rates: RateEntity[];

  @ManyToMany(() => EmployeeEntity, (employee) => employee.services)
  employees: EmployeeEntity[];
}
