import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { CrudEntity } from './crud.entity';
import { ICrudService } from './crud.service.inerface';
import {
  getSearchQuery,
  getSelectedFields,
  getSelectedFilters,
  getSelectedOrder,
  getSelectedPagnation,
  getSelectedRelations,
} from './helpers/query.helpers';
import { Request } from 'express';

@Injectable()
export class CrudService<T extends CrudEntity> implements ICrudService<T> {
  constructor(
    @InjectRepository(CrudEntity)
    protected readonly entityRepository: Repository<CrudEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(newEntity: T): Promise<T> {
    try {
      const createdEntity = this.entityRepository.create(newEntity);
      const savedEntity = (await this.entityRepository.save(
        createdEntity,
      )) as T;
      this.eventEmitter.emit('entity.created', savedEntity);
      return savedEntity;
    } catch (err) {
      throw err;
    }
  }

  async findAll(req: Request): Promise<[T[], number]> {
    const { fields, page, limit, relations, order, filters, search } =
      req.query;

    const selectedFields = getSelectedFields(fields as string);
    const selectedRelations = getSelectedRelations(relations as string);
    const selectedOrder = getSelectedOrder(order as string);
    const searchQuery = getSearchQuery(search as string);
    const { take, skip } = getSelectedPagnation(
      page as string,
      limit as string,
    );
    const selectedFilters = getSelectedFilters(filters as string);

    const filterAndSearch = [];


    console.log(searchQuery);
    searchQuery
      ? searchQuery.forEach((q) => {
          filterAndSearch.push({ ...selectedFilters, ...q });
        })
      : '';

    return (await this.entityRepository.findAndCount({
      select: selectedFields,
      order: selectedOrder,
      skip,
      take,
      relations: selectedRelations,
      // loadRelationIds: !selectedRelations,
      where: filterAndSearch || selectedFilters,
    })) as [T[], number];
  }

  async findActive(
    fields?: string[],
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
    try {
      const item = (await this.entityRepository.findOne({
        where: { id: Equal(id) },
      })) as T;

      if (!item) throw new NotFoundException(`Item with id ${id} not found.`);

      return item;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updatedEntity: Partial<Omit<T, 'id'>>): Promise<T> {
    try {
      const existingEntity = await this.entityRepository.findOne({
        where: { id: Equal(id) },
      });

      if (!existingEntity) throw new NotFoundException();

      Object.assign(existingEntity, updatedEntity);

      const savedEntity = (await this.entityRepository.save(
        existingEntity,
      )) as T;
      this.eventEmitter.emit('entity.updated', savedEntity);
      return savedEntity;
    } catch (err) {
      throw err;
    }
  }

  async update2(id: number, updatedEntity: T): Promise<number | T | void> {
    try {
      // const existingEntity = await this.entityRepository.findOne({
      //   where: { id: Equal(id) },
      // });

      // if (!existingEntity) {
      //   try {
      //     const newEntity = await this.create(updatedEntity);
      //     return newEntity.id;
      //   } catch (err) {
      //     throw err;
      //   }
      // }

      // Object.assign(existingEntity, updatedEntity);

      // const savedEntity = (await this.entityRepository.save(
      //   existingEntity,
      // )) as T;
      console.log('update', { ...updatedEntity, id });
      const savedEntity = await this.entityRepository.upsert(
        { ...updatedEntity, id },
        {
          conflictPaths: ['id'],
          skipUpdateIfNoValuesChanged: false,
          upsertType: 'on-conflict-do-update',
        },
      );

      console.log(savedEntity);
      this.eventEmitter.emit('entity.updated', savedEntity);
      return 8;
    } catch (err) {
      console.log(err);
      throw err;
    }
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
    try {
      const removedEntity = await this.entityRepository.delete(id);
      if (removedEntity.affected == 0)
        throw new NotFoundException(`Item with id ${id} not found.`);
      this.eventEmitter.emit('entity.deleted', removedEntity);
      return removedEntity;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
