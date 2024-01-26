import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ServiceEntity } from '../services/service.entity';
import { ShopEntity } from '../shop/shop.entity';
import { RateEntity } from '../rates/rate.entity';
import { AppointmentEntity } from '../appointment/appointment.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CrudEntity } from '../crud/crud.entity';

@Entity({ name: 'employees' })
export class EmployeeEntity extends CrudEntity {
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @ManyToMany(() => ServiceEntity, (service) => service.employees)
  @JoinTable()
  services: ServiceEntity[];
  @OneToMany(() => AppointmentEntity, (appointement) => appointement.employee)
  appointements: AppointmentEntity;
  @ManyToOne(() => ShopEntity, (shop) => shop.employees)
  shop: ShopEntity;
  @Column({ nullable: true })
  shopId: number;
  @OneToMany(() => RateEntity, (rate) => rate.employee)
  rates: RateEntity[];
}
