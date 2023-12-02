import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { ShiftEntity } from '../shifts/shift.entity';
import { ServiceEntity } from '../services/service.entity';
import { RateEntity } from '../rates/rate.entity';
import { EmployeeEntity } from '../employees/employee.entity';
import { AppointmentEntity } from '../appointment/appointment.entity';

@Entity({ name: 'shops' })
export class ShopEntity extends CrudEntity {
  @Column()
  name: string;
  @Column()
  displayName: string;
  @Column({ nullable: true })
  slotDuration: number;
  @Column({ nullable: true })
  country: string;
  @Column({ nullable: true })
  city: string;
  @Column({ nullable: true })
  address: string;
  @OneToMany(() => ShiftEntity, (shift) => shift.shop, { eager: true })
  @JoinColumn()
  shifts: ShiftEntity[];
  @OneToMany(() => ServiceEntity, (service) => service.shop, { eager: true })
  @JoinColumn()
  services: ServiceEntity[];
  @OneToMany(() => RateEntity, (rate) => rate.shop, { eager: true })
  rates: RateEntity[];
  @OneToMany(() => EmployeeEntity, (employee) => employee.shop, { eager: true })
  employees: EmployeeEntity[];
  @OneToMany(() => AppointmentEntity, (appointement) => appointement.shop)
  appointments: AppointmentEntity[];
}
