import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { CrudEntity } from './crud.entity';
import { ICrudService } from './crud.service.inerface';

@Injectable()
export class CrudService<T extends CrudEntity> implements ICrudService<T> {
  constructor(
    @InjectRepository(CrudEntity)
    protected readonly entityRepository: Repository<CrudEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(newEntity: T): Promise<T> {
    const createdEntity = this.entityRepository.create(newEntity);
    const savedEntity = (await this.entityRepository.save(createdEntity)) as T;
    this.eventEmitter.emit('entity.created', savedEntity);
    return savedEntity;
  }

  async findAll(
    skip?: number,
    take?: number,
    relations?: string[],
  ): Promise<T[]> {
    return (await this.entityRepository.find({
      order: { id: 'ASC' },
      skip,
      take,
      relations,
    })) as T[];
  }

  async findActive(
    skip?: number,
    take?: number,
    relations?: string[],
  ): Promise<T[]> {
    return (await this.entityRepository.find({
      where: { isActive: true },
      order: { id: 'ASC' },
      skip,
      take,
      relations,
    })) as T[];
  }

  async findOne(id: number): Promise<T> {
    return (await this.entityRepository.findOne({
      where: { id: Equal(id) },
    })) as T;
  }

  async update(id: number, updatedEntity: Partial<Omit<T, 'id'>>): Promise<T> {
    const existingEntity = await this.entityRepository.findOne({
      where: { id: Equal(id) },
    });

    Object.assign(existingEntity, updatedEntity);

    const savedEntity = (await this.entityRepository.save(existingEntity)) as T;
    this.eventEmitter.emit('entity.updated', savedEntity);
    return savedEntity;
  }

  async softRemove(id: number): Promise<T> {
    const existingEntity = await this.entityRepository.findOne({
      where: { id: Equal(id) },
    });

    Object.assign(existingEntity, { isActive: false });

    const softRemovedEntity = (await this.entityRepository.save(
      existingEntity,
    )) as T;
    return softRemovedEntity;
  }

  async restore(id: number): Promise<T> {
    const existingEntity = await this.entityRepository.findOne({
      where: { id: Equal(id) },
    });

    Object.assign(existingEntity, { isActive: true });
    const restoredEntity = (await this.entityRepository.save(
      existingEntity,
    )) as T;
    return restoredEntity;
  }

  async remove(id: number) {
    const removedEntity = await this.entityRepository.delete(id);
    this.eventEmitter.emit('entity.deleted', removedEntity);
    return removedEntity;
  }
}
