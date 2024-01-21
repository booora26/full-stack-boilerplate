import { BadRequestException } from '@nestjs/common';
import {
  And,
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

  const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
  const validateOrderParams = (order: string) => {
    if (!order.match(sortPattern))
      throw new BadRequestException('Invalid sort parameter');
  };
  const selectedOrder = {};
  order.split(';').forEach((o) => {
    validateOrderParams(o);
    const i = o.split(':');
    Object.assign(selectedOrder, { [i[0]]: i[1].toUpperCase() });
  });
  return selectedOrder;
};

export const getSelectedPagnation = (page: string, limit: string) => {
  // check if page and size are valid
  if (
    (page && Number(page) < 1) ||
    (limit && Number(limit) < 1) ||
    (isNaN(Number(limit)) && page)
  ) {
    throw new BadRequestException('Invalid pagination params');
  }
  let take: number | null;
  limit ? (take = Number(limit)) : take;
  let skip: number | null;
  page ? (skip = (Number(page) - 1) * Number(limit)) : skip;

  return { take, skip };
};

export const getSelectedFilters = (filters: string) => {
  if (!filters) return {};

  // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
  const validateFilterParams = (filter: string) => {
    if (
      !filter.match(
        /^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9_\-,]+$/,
      ) &&
      !filter.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull)$/)
    ) {
      throw new BadRequestException('Invalid filter parameter');
    }
  };
  const selectedFilters = new Object();
  filters.split(';').forEach((f) => {
    validateFilterParams(f);
    const i = f.split(':');
    let field;
    const previousFilter = selectedFilters[i[0]];
    if (i[1] == FilterRule.IS_NULL) field = IsNull();
    if (i[1] == FilterRule.IS_NOT_NULL) field = Not(IsNull());
    if (i[1] == FilterRule.EQUALS) field = i[2];
    if (i[1] == FilterRule.NOT_EQUALS) field = Not(i[2]);
    if (i[1] == FilterRule.GREATER_THAN) field = MoreThan(i[2]);
    if (i[1] == FilterRule.GREATER_THAN_OR_EQUALS)
      field = MoreThanOrEqual(i[2]);
    if (i[1] == FilterRule.LESS_THAN) field = LessThan(i[2]);
    if (i[1] == FilterRule.LESS_THAN_OR_EQUALS) field = LessThanOrEqual(i[2]);
    if (i[1] == FilterRule.LIKE) field = ILike(`%${i[2]}%`);
    if (i[1] == FilterRule.NOT_LIKE) field = Not(ILike(`%${i[2]}%`));
    if (i[1] == FilterRule.IN) field = In(i[2].split(','));
    if (i[1] == FilterRule.NOT_IN) field = Not(In(i[2].split(',')));

    selectedFilters.hasOwnProperty(i[0])
      ? Object.assign(selectedFilters, { [i[0]]: And(previousFilter, field) })
      : Object.assign(selectedFilters, { [i[0]]: field });
  });
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
