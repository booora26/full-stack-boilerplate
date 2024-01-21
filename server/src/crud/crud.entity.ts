import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CrudEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
