import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, EntityMetadata } from 'typeorm';
import QueryString from 'qs';
import { CrudEntity } from './crud.entity';
import { ICrudService } from './crud.service.inerface';
import {
  generateRelationQuery,
  getSearchQuery,
  getSelectedFields,
  getSelectedFilters,
  getSelectedOrder,
  getSelectedPagnation,
  getSelectedRelations,
} from './helpers/query.helpers';
import { Request } from 'express';
import {
  createRelationEntities,
  getEntityRelations,
} from './helpers/relations.helpers';

@Injectable()
export class CrudService<T extends CrudEntity> implements ICrudService<T> {
  constructor(
    @InjectRepository(CrudEntity)
    protected readonly entityRepository: Repository<CrudEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  metadata: EntityMetadata = this.entityRepository.metadata;

  async create(newEntity: T): Promise<T> {
    try {
      const relationEntities = createRelationEntities(this.metadata, newEntity);

      Object.assign(newEntity, relationEntities);

      const createdEntity = this.entityRepository.create(newEntity);
      const savedEntity = (await this.entityRepository.save(
        createdEntity,
      )) as T;

      this.eventEmitter.emit(
        `${this.metadata.targetName}.created`,
        savedEntity,
      );
      return savedEntity;
    } catch (err) {
      throw err;
    }
  }

  async findAll(req: Request): Promise<[T[], number]> {
    const { fields, page, limit, relations, order, filters, search } =
      req.query;

    const selectedFields = getSelectedFields(fields as string, this.metadata);
    const selectedRelations = getSelectedRelations(
      relations as string,
      this.metadata,
    );
    const selectedOrder = getSelectedOrder(order as string, this.metadata);
    const searchQuery = getSearchQuery(search as string, this.metadata);
    const { take, skip } = getSelectedPagnation(
      page as string,
      limit as string,
    );
    const selectedFilters = getSelectedFilters(
      filters as string,
      this.metadata,
    );

    const filterAndSearch = [];

    searchQuery
      ? searchQuery.forEach((q) => {
          filterAndSearch.push({ ...selectedFilters, ...q });
        })
      : '';

    let selectedFiltersAndSearch;

    filterAndSearch.length
      ? (selectedFiltersAndSearch = filterAndSearch)
      : (selectedFiltersAndSearch = selectedFilters);

    // const rel = this.entityRepository.metadata.relations[0];

    return (await this.entityRepository.findAndCount({
      select: selectedFields,
      order: selectedOrder,
      skip,
      take,
      relations: selectedRelations,
      // loadRelationIds: !selectedRelations,
      where: selectedFiltersAndSearch,
    })) as [T[], number];
  }

  async findOne(
    id: number,
    query: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[],
  ): Promise<T> {
    try {
      const { fields, relations } = query as any;
      const selectedFields = getSelectedFields(fields as string, this.metadata);
      const selectedRelations = getSelectedRelations(
        relations as string,
        this.metadata,
      );

      const item = (await this.entityRepository.findOne({
        where: { id: Equal(id) },
        select: selectedFields,
        relations: selectedRelations,
      })) as T;

      if (!item) throw new NotFoundException(`Item with id ${id} not found.`);

      return item;
    } catch (err) {
      throw err;
    }
  }
  async findOneWithRelations(req: Request): Promise<T> {
    try {
      const { fields: queryFields, relations: queryRelations } = req.query;
      const { id, relation } = req.params;

      const { where, select, relations } = generateRelationQuery(
        +id,
        queryFields,
        queryRelations,
        relation,
        this.metadata,
      );

      const item = (await this.entityRepository.findOne({
        where,
        select,
        relations,
      })) as T;

      if (!item) throw new NotFoundException(`Item with id ${id} not found.`);

      return item[relation];
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

      const relationEntities = createRelationEntities(
        this.metadata,
        updatedEntity,
      );

      Object.assign(updatedEntity, relationEntities);

      Object.assign(existingEntity, updatedEntity);

      const savedEntity = (await this.entityRepository.save(
        existingEntity,
      )) as T;
      this.eventEmitter.emit(
        `${this.metadata.targetName}.updated`,
        savedEntity,
      );
      return savedEntity;
    } catch (err) {
      throw err;
    }
  }

  async update2(updatedEntity: T, id?: number): Promise<number | T | void> {
    try {
      if (!id) {
        try {
          const newEntity = await this.create(updatedEntity);
          return newEntity.id;
        } catch (err) {
          throw err;
        }
      }

      const existingEntity = await this.entityRepository.findOne({
        where: { id: Equal(id) },
      });

      if (!existingEntity) throw new NotFoundException();

      const relationEntities = createRelationEntities(
        this.metadata,
        updatedEntity,
      );

      Object.assign(updatedEntity, relationEntities);

      Object.assign(existingEntity, updatedEntity);

      const savedEntity = (await this.entityRepository.save(
        existingEntity,
      )) as T;

      console.log(savedEntity);
      this.eventEmitter.emit('entity.updated', savedEntity);
      return savedEntity;
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
      this.eventEmitter.emit(
        `${this.metadata.targetName}.deleted`,
        removedEntity,
      );
      return removedEntity;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
