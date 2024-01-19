import {
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

export const getSelectedFields = (fields: string) => {
  if (!fields) return {};
  return fields.split(',');
};

export const getSelectedRelations = (relations: string) => {
  if (!relations) return {};
  return relations.split(',');
};

export const getSelectedOrder = (order: string) => {
  if (!order) return {};
  const selectedOrder = {};
  order.split(';').forEach((o) => {
    const i = o.split(':');
    Object.assign(selectedOrder, { [i[0]]: i[1].toUpperCase() });
  });
  return selectedOrder;
};

export const getSelectedPagnation = (page: number, limit: number) => {
  let take: number | null;
  limit ? (take = limit) : take;
  let skip: number | null;
  page ? (skip = (page - 1) * limit) : skip;

  return { take, skip };
};

export const getSelectedFilters = (filters: string) => {
  if (!filters) return {};
  const selectedFilters = {};
  filters.split(';').forEach((f) => {
    const i = f.split(':');
    if (i[1] == FilterRule.IS_NULL)
      Object.assign(selectedFilters, { [i[0]]: IsNull() });
    if (i[1] == FilterRule.IS_NOT_NULL)
      Object.assign(selectedFilters, { [i[0]]: Not(IsNull()) });
    if (i[1] == FilterRule.EQUALS)
      Object.assign(selectedFilters, { [i[0]]: i[2] });
    if (i[1] == FilterRule.NOT_EQUALS)
      Object.assign(selectedFilters, { [i[0]]: Not(i[2]) });
    if (i[1] == FilterRule.GREATER_THAN)
      Object.assign(selectedFilters, { [i[0]]: MoreThan(i[2]) });
    if (i[1] == FilterRule.GREATER_THAN_OR_EQUALS)
      Object.assign(selectedFilters, { [i[0]]: MoreThanOrEqual(i[2]) });
    if (i[1] == FilterRule.LESS_THAN)
      Object.assign(selectedFilters, { [i[0]]: LessThan(i[2]) });
    if (i[1] == FilterRule.LESS_THAN_OR_EQUALS)
      Object.assign(selectedFilters, { [i[0]]: LessThanOrEqual(i[2]) });
    if (i[1] == FilterRule.LIKE)
      Object.assign(selectedFilters, { [i[0]]: ILike(`%${i[2]}%`) });
    if (i[1] == FilterRule.NOT_LIKE)
      Object.assign(selectedFilters, { [i[0]]: Not(ILike(`%${i[2]}%`)) });
    if (i[1] == FilterRule.IN)
      Object.assign(selectedFilters, { [i[0]]: In(i[2].split(',')) });
    if (i[1] == FilterRule.NOT_IN)
      Object.assign(selectedFilters, { [i[0]]: Not(In(i[2].split(','))) });
  });
  console.log(selectedFilters);
  return selectedFilters;
};

export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}
