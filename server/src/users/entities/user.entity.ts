import { Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';

@Entity({ name: 'users' })
export class UserEntity extends CrudEntity {
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
}
