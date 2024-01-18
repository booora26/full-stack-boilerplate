export interface ICrudService<T> {
  findAll(
    fields?: string,
    page?: number,
    limit?: number | null,
    order?: string | null,
    relations?: string,
  ): Promise<[T[], number]>;
  findActive(
    fields?: string[],
    page?: number,
    limit?: number | null,
    relations?: string[],
  ): Promise<T[]>;
  findOne(id: number): Promise<T>;
  create(newEntity: T): Promise<T>;
  update(id: number, entity: T): Promise<T>;
  softRemove(id: number): void;
  restore(id: number): Promise<T>;
  remove(id: number): void;
}
