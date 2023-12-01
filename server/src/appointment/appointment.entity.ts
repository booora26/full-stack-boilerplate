import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { AppointementStatus } from './appointement-status.enum';
import { EmployeeEntity } from '../employees/employee.entity';
import { ShopEntity } from '../shop/shop.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ServiceEntity } from '../services/service.entity';

@Entity({ name: 'appointements' })
export class AppointmentEntity extends CrudEntity {
  @ManyToOne(() => ShopEntity, (shop) => shop.appointments)
  shop: ShopEntity;
  @ManyToOne(() => EmployeeEntity, (employee) => employee.appointements)
  employee: EmployeeEntity;
  @ManyToOne(() => ServiceEntity)
  service?: ServiceEntity;
  @Column({ nullable: true })
  serviceId?: number;
  @ManyToOne(() => UserEntity)
  user?: UserEntity;
  @Column({ nullable: true })
  userId?: number;
  @Column()
  date: Date;
  @Column()
  slot: string;
  @Column({ default: 0 })
  slotNumber: number;
  @Column({
    type: 'enum',
    enum: AppointementStatus,
    default: AppointementStatus.AVAILABLE,
  })
  status: AppointementStatus;
}
