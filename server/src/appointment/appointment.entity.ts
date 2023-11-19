import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { AppointementStatus } from './appointement-status.enum';

@Entity({ name: 'appointements' })
export class AppointmentEntity extends CrudEntity {
  @Column()
  shopId: number;
  @Column()
  employeeId: number;
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
