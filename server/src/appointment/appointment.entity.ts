import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { AppointementStatus } from './appointement-status.enum';
import { EmployeeEntity } from '../employees/employee.entity';
import { ShopEntity } from '../shop/shop.entity';

@Entity({ name: 'appointements' })
export class AppointmentEntity extends CrudEntity {
  @ManyToOne(() => ShopEntity, (shop) => shop.appointments)
  shop: ShopEntity;
  @ManyToOne(() => EmployeeEntity, (employee) => employee.appointements)
  employee: EmployeeEntity;
  @Column({ nullable: true })
  userId?: number;
  @Column({ nullable: true })
  serviceId?: number;
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
