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
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
