import { BeforeInsert, Column, Entity } from 'typeorm';
import * as crypto from 'crypto';
import { CrudEntity } from '../../crud/crud.entity';

@Entity({ name: 'users' })
export class UserEntity extends CrudEntity {
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  password?: string;
  @Column({ nullable: true })
  salt?: string;
  @Column({ default: false })
  externalProvider: boolean;

  @BeforeInsert()
  async hashPassword() {
    if (this.externalProvider === true) return;
    this.salt = crypto.randomBytes(16).toString('hex');
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
