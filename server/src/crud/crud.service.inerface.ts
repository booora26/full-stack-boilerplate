import { Request } from 'express';
import QueryString from 'qs';

export interface ICrudService<T> {
  findAll(req?: Request): Promise<[T[], number]>;
  findOne(
    id: number,
    query: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[],
  ): Promise<T>;
  create(newEntity: T): Promise<T>;
  update(id: number, entity: T): Promise<T>;
  softRemove(id: number): void;
  restore(id: number): Promise<T>;
  remove(id: number): void;
}
