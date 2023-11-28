import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { PermissionEntity } from '../permissions/permission.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends CrudEntity {
  @Column()
  name: string;
  // Relationship with Permission entity
  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
    eager: true,
  })
  @JoinTable()
  permissions: PermissionEntity[];
//   @ManyToMany(() => UserEntity, (user) => user.roles)
//   @JoinTable()
//   users: UserEntity[];
}
