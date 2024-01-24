import { Request, Response } from 'express';

export interface ICrudService<T> {
  findAll(req?: Request): Promise<[T[], number]>;
  findActive(
    fields?: string[],
    page?: number,
    limit?: number | null,
    relations?: string[],
  ): Promise<T[]>;
  findOne(id: number, query): Promise<T>;
  create(newEntity: T): Promise<T>;
  update(id: number, entity: T): Promise<T>;
  softRemove(id: number): void;
  restore(id: number): Promise<T>;
  remove(id: number): void;
}
