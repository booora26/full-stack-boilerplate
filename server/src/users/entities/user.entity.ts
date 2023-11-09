import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
} from 'typeorm';
import * as crypto from 'crypto';
import { CrudEntity } from '../../crud/crud.entity';
import { RoleEntity } from '../../authz/roles/role.entity';

@Entity({ name: 'users' })
export class UserEntity extends CrudEntity {
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  password?: string;
  @Column({ nullable: true })
  salt?: string;
  @Column({ nullable: true })
  image?: string;
  @Column({ default: false })
  externalProvider: boolean;

  @Column({ nullable: true })
  twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @ManyToMany(() => RoleEntity, (role) => role.users, { eager: true })
  roles?: RoleEntity[];

  @BeforeInsert()
  async hashPassword() {
    console.log('create password');
    if (this.externalProvider === true) return;
    this.salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto
      .pbkdf2Sync(this.password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    this.password = hashedPassword;
  }

  @BeforeUpdate()
  async updateHashPassword() {
    console.log('update password');
    // this.salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto
      .pbkdf2Sync(this.password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    this.password = hashedPassword;
  }

  async validatePassword(password: string): Promise<boolean> {
    const hashedPassword = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return this.password === hashedPassword;
  }
}
