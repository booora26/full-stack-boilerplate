import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { ShopEntity } from '../shop/shop.entity';
import { RateEntity } from '../rates/rate.entity';
import { EmployeeEntity } from '../employees/employee.entity';
import { AppointmentEntity } from '../appointment/appointment.entity';

@Entity({ name: 'service' })
export class ServiceEntity extends CrudEntity {
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'integer' })
  duration: number;
  @ManyToOne(() => ShopEntity, (shop) => shop.services)
  shop: ShopEntity;
  // @OneToMany(() => RateEntity, (rate) => rate.service)
  // rates: RateEntity[];

  @ManyToMany(() => EmployeeEntity, (employee) => employee.services)
  employees: EmployeeEntity[];
  @OneToMany(() => AppointmentEntity, (appointement) => appointement.service)
  appointements: AppointmentEntity[];
}
