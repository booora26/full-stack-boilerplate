import {
  AfterInsert,
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bills')
export class BillEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  location: string;

  @BeforeInsert()
  addPrefixToId() {
    // Postavite željeni prefiks
    const prefix = 'bill-';
    this.id = `${prefix}${this.id}`;
  }
}
