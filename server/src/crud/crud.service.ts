import { Injectable } from '@nestjs/common';
import { ICrudService } from './crud.service.inerface';
import { CrudEntity } from './crud.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CrudService<T extends CrudEntity> implements ICrudService<T> {
  constructor(
    @InjectRepository(CrudEntity) private repo: Repository<CrudEntity>,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(newEntity: T): Promise<T> {
    try {
      const entity = this.repo.create(newEntity);
      const savedEntity = this.repo.save(entity) as Promise<T>;
      this.eventEmitter.emit('entity.created', await savedEntity);
      return await savedEntity;
    } catch (err) {
      throw new Error(err);
    }
  }
  findAll(skip: number, take: number, relations: string[]): Promise<T[]> {
    try {
      return this.repo.find({
        order: { id: 'ASC' },
        skip,
        take,
        relations,
      }) as Promise<T[]>;
    } catch (err) {
      throw new Error(err);
    }
  }
  findActive(skip: number, take: number, relations: string[]): Promise<T[]> {
    try {
      return this.repo.find({
        where: { isActive: true },
        order: { id: 'ASC' },
        skip,
        take,
        relations,
      }) as Promise<T[]>;
    } catch (err) {
      throw new Error(err);
    }
  }
  findOne(id: number): Promise<T> {
    try {
      return this.repo.findOne({ where: { id: Equal(id) } }) as Promise<T>;
    } catch (err) {
      throw new Error(err);
    }
  }
  async update(id: number, updatedEntity: Partial<Omit<T, 'id'>>): Promise<T> {
    const entity = await this.repo.findOne({
      where: { id: Equal(id) },
    });

    Object.assign(entity, updatedEntity);

    const savedEntity = this.repo.save(entity) as Promise<T>;
    this.eventEmitter.emit('entity.updated', await savedEntity);
    return await savedEntity;
  }
  async softRemove(id: number): Promise<T> {
    const entity = await this.repo.findOne({
      where: { id: Equal(id) },
    });

    Object.assign(entity, { isActive: false });

    const softRemovedEntity = this.repo.save(entity) as Promise<T>;
    return await softRemovedEntity;
  }
  async restore(id: number): Promise<T> {
    const entity = await this.repo.findOne({
      where: { id: Equal(id) },
    });

    Object.assign(entity, { isActive: true });
    const restoredEntity = this.repo.save(entity) as Promise<T>;
    return await restoredEntity;
  }

  async remove(id: number) {
    const removedEntity = await this.repo.delete(id);
    this.eventEmitter.emit('entity.deleted', removedEntity);
    return removedEntity;
  }
}
