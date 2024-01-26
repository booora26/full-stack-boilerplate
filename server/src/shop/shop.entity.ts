import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { ShiftEntity } from '../shifts/shift.entity';
import { ServiceEntity } from '../services/service.entity';
import { RateEntity } from '../rates/rate.entity';
import { EmployeeEntity } from '../employees/employee.entity';
import { AppointmentEntity } from '../appointment/appointment.entity';

@Entity({ name: 'shops' })
export class ShopEntity extends CrudEntity {
  @Column({ type: 'varchar' })
  name: string;
  @Column({ name: 'display_name', type: 'varchar' })
  displayName: string;
  @Column({ nullable: true })
  slotDuration: number;
  @Column({ nullable: true, type: 'varchar' })
  country: string;
  @Column({ nullable: true, type: 'varchar' })
  city: string;
  @Column({ nullable: true, type: 'varchar' })
  address: string;
  @OneToMany(() => ShiftEntity, (shift) => shift.shop)
  @JoinColumn()
  shifts: ShiftEntity[];
  @OneToMany(() => ServiceEntity, (service) => service.shop)
  @JoinColumn()
  services: ServiceEntity[];
  @OneToMany(() => RateEntity, (rate) => rate.shop)
  rates: RateEntity[];
  @OneToMany(() => EmployeeEntity, (employee) => employee.shop)
  employees: EmployeeEntity[];
  @OneToMany(() => AppointmentEntity, (appointement) => appointement.shop)
  appointements: AppointmentEntity[];
}
