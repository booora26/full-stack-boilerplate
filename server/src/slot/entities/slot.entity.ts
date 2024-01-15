import { Entity } from 'typeorm';
import { CrudEntity } from '../../crud/crud.entity';

@Entity()
export class Slot extends CrudEntity {}
