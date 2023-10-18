export interface ICrudService<T> {
  findAll(
    skip?: number,
    take?: number | null,
    relations?: string[],
  ): Promise<T[]>;
  findActive(
    skip?: number,
    take?: number | null,
    relations?: string[],
  ): Promise<T[]>;
  findOne(id: number): Promise<T>;
  create(newEntity: T): Promise<T>;
  update(id: number, entity: T): Promise<T>;
  softRemove(id: number): void;
  restore(id: number): Promise<T>;
  remove(id: number): void;
}
