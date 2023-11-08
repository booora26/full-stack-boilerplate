import { BeforeInsert, Column, Entity, ManyToMany } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';
import { RoleEntity } from '../roles/role.entity';

@Entity({ name: 'permissions' })
export class PermissionEntity extends CrudEntity {
  @Column()
  name: string;
  @Column()
  slug: string;
  @Column({ nullable: true })
  description?: string;

  // Relationship with Role entity
  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];

  @BeforeInsert()
  async createSlug() {
    this.slug = this.name.replaceAll(' ', '-');
  }
}
