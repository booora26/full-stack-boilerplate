import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, EntityMetadata } from 'typeorm';
import QueryString from 'qs';
import { CrudEntity } from './crud.entity';
import { ICrudService } from './crud.service.inerface';
import {
  generateFindAllQuery,
  generateFindOneQuery,
  generateRelationQuery,
} from './helpers/query.helpers';
import { Request } from 'express';
import { createRelationEntities } from './helpers/relations.helpers';
import {
  generateMetadataLinks,
  generateSelfLink,
} from './helpers/metadata.helpers';

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
    const { select, order, skip, take, relations, where } =
      generateFindAllQuery(req, this.metadata);

    const [items, count] = (await this.entityRepository.findAndCount({
      select,
      order,
      skip,
      take,
      relations,
      where,
    })) as [T[], number];

    items.map((i) => Object.assign(i, generateSelfLink(req, i.id)));

    return [items, count];
  }

  async findOne(
    id: number,
    query: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[],
    req?: Request,
  ): Promise<T> {
    try {
      const { select, relations } = generateFindOneQuery(query, this.metadata);

      const item = (await this.entityRepository.findOne({
        where: { id: Equal(id) },
        select,
        relations,
      })) as T;

      if (!item) throw new NotFoundException(`Item with id ${id} not found.`);

      const links = generateMetadataLinks(this.metadata, req);

      Object.assign(item, links);

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

      item[relation].map((i) => Object.assign(i, generateSelfLink(req, i.id)));

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

      this.eventEmitter.emit('entity.updated', savedEntity);
      return savedEntity;
    } catch (err) {
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
