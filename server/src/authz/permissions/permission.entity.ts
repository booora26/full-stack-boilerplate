import { BeforeInsert, Column, Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';

@Entity({ name: 'permissions' })
export class PermissionEntity extends CrudEntity {
  @Column()
  name: string;
  @Column()
  slug: string;
  @Column({ nullable: true })
  description?: string;

  @BeforeInsert()
  async createSlug() {
    this.slug = this.name.replace(' ', '-');
  }
}
