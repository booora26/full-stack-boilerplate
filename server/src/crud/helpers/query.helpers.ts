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

export const getSelectedFields = (fields: string, metadata) => {
  if (!fields) return {};
  const possibleFields = metadata.columns.map((r) => r.propertyName);

  const selectedFields = fields.split(',');

  selectedFields.forEach((sf) => {
    if (!possibleFields.includes(sf)) {
      throw new BadRequestException(
        `Field ${sf.toUpperCase()} do not exists in ${metadata.name}.${
          possibleFields.length
            ? ` Possible fields are ${possibleFields
                .toString()
                .replaceAll(',', ', ')}.`
            : ' This resource does not have any fields.'
        }`,
      );
    }
  });

  return selectedFields;
};

export const getSelectedRelations = (relations: string, metadata) => {
  if (!relations) return {};

  const selectedRelations = relations.split(',');

  const possibleRelations = metadata.relations.map((r) => r.propertyName);

  selectedRelations.forEach((sr) => {
    if (!possibleRelations.includes(sr)) {
      throw new BadRequestException(
        `Relation ${sr.toUpperCase()} do not exists.${
          possibleRelations.length
            ? ` Possible relations are ${possibleRelations
                .toString()
                .replaceAll(',', ', ')}.`
            : ' This resource does not have any relations.'
        }`,
      );
    }
  });
  return selectedRelations;
};

export const getSelectedOrder = (order: string, metadata) => {
  if (!order) return {};

  const possibleFields = metadata.columns.map((r) => r.propertyName);

  const sortPattern = /^([a-zA-Z0-9]+)|(asc|desc|ASC|DESC)$/;
  const validateOrderParams = (order: string) => {
    if (!order.match(sortPattern))
      throw new BadRequestException('Invalid sort parameter.');
  };
  const selectedOrder = {};
  if (order && typeof order == 'object')
    throw new BadRequestException(
      'Field ORDER should be used only once in query.',
    );
  order.split(';').forEach((o) => {
    validateOrderParams(o);
    const [field, order] = o.split('|');
    if (!possibleFields.includes(field))
      throw new BadRequestException(
        `Field ${field.toUpperCase()} do not exists in ${metadata.name}.${
          possibleFields.length
            ? ` Possible fields are ${possibleFields
                .toString()
                .replaceAll(',', ', ')}`
            : ' This resource does not have any fields.'
        }`,
      );
    Object.assign(selectedOrder, { [field]: order.toUpperCase() });
  });
  return selectedOrder;
};
export const getSearchQuery = (search: string, metadata) => {
  if (!search) return;

  if (search && typeof search == 'object')
    throw new BadRequestException(
      'Field SEARCH should be used only once in query.',
    );

  const searchPattern = /^([a-zA-Z0-9,-_\.]+)|([a-zA-Z0-9,-;_\.\s ]+)$/;
  console.log(search.match(search));
  const validateSearchQuery = (search: string) => {
    if (!search.match(searchPattern))
      throw new BadRequestException('Invalid search parameter');
  };

  const searchableFields = [];
  metadata.columns.map((c) => {
    if (c.type === 'varchar' || c.type === 'text') {
      searchableFields.push(c.propertyName);
    }
  });

  validateSearchQuery(search);
  const searchQuery = [];
  const [keys, value] = search.split('|');

  keys.split(',').forEach((k) => {
    if (!searchableFields.includes(k))
      throw new BadRequestException(
        `Field ${k.toUpperCase()} is not searchable. Searchable fields are ${searchableFields}.`,
      );
    searchQuery.push({ [k]: ILike(`%${value}%`) });
  });

  return searchQuery;
};

export const getSelectedPagnation = (page: string, limit: string) => {
  // check if page and size are valid
  if (
    (page && Number(page) < 1) ||
    (limit && Number(limit) < 1) ||
    (isNaN(Number(limit)) && page)
  ) {
    throw new BadRequestException('Invalid pagination params.');
  }
  let take: number | null;
  limit ? (take = Number(limit)) : take;
  let skip: number | null;
  page ? (skip = (Number(page) - 1) * Number(limit)) : skip;

  return { take, skip };
};

export const getSelectedFilters = (filters: string, metadata) => {
  if (!filters) return {};

  if (filters && typeof filters == 'object')
    throw new BadRequestException(
      'Field FILTERS should be used only once in query.',
    );

  const possibleFields = metadata.columns.map((r) => r.propertyName);

  const fieldTypes = new Object();
  metadata.columns.map((c) => {
    Object.assign(fieldTypes, { [c.propertyName]: c.type });
  });

  console.log(fieldTypes);

  const operatorTypes = {
    like: ['varchar', 'text', 'char'],
    nlike: ['varchar', 'text', 'char'],
    eq: [
      'varchar',
      'text',
      'char',
      'enum',
      'timestamp',
      'integer',
      'float',
      'float4',
      'boolean',
    ],
    neq: [
      'varchar',
      'text',
      'char',
      'enum',
      'timestamp',
      'integer',
      'float',
      'float4',
      'boolean',
    ],
    gt: [
      'varchar',
      'text',
      'char',
      'enum',
      'timestamp',
      'integer',
      'float',
      'float4',
    ],
    gte: [
      'varchar',
      'text',
      'char',
      'enum',
      'timestamp',
      'integer',
      'float',
      'float4',
      'boolean',
    ],
    lt: [
      'varchar',
      'text',
      'char',
      'enum',
      'timestamp',
      'integer',
      'float',
      'float4',
      'boolean',
    ],
    lte: [
      'varchar',
      'text',
      'char',
      'enum',
      'timestamp',
      'integer',
      'float',
      'float4',
      'boolean',
    ],
    in: [
      'varchar',
      'text',
      'char',
      'enum',
      'timestamp',
      'integer',
      'float',
      'float4',
    ],
    nin: [
      'varchar',
      'text',
      'char',
      'enum',
      'timestamp',
      'integer',
      'float',
      'float4',
    ],
    isnull: [
      'varchar',
      'text',
      'char',
      'enum',
      'timestamp',
      'integer',
      'float',
      'float4',
      'boolean',
    ],
    isnotnull: [
      'varchar',
      'text',
      'char',
      'enum',
      'timestamp',
      'integer',
      'float',
      'float4',
      'boolean',
    ],
  };

  // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
  const validateFilterParams = (filter: string) => {
    if (
      !filter.match(
        /^([a-zA-Z0-9_]+)\|(eq|neq|gt|gte|lt|lte|like|nlike|in|nin)\|([a-zA-Z0-9_\-, ]+)$/,
      ) &&
      !filter.match(/^[a-zA-Z0-9_]+\|(isnull|isnotnull)$/)
    ) {
      throw new BadRequestException(
        'Invalid filter parameter. Use | as separator and available operators eq, neq, gt, gte, lt, lte, like, nlike, in, nin ',
      );
    }
  };
  const selectedFilters = new Object();
  filters.split(';').forEach((f) => {
    validateFilterParams(f);
    const i = f.split('|');
    if (!possibleFields.includes(i[0]))
      throw new BadRequestException(
        `Field ${i[0].toUpperCase()} do not exists in ${metadata.name}.${
          possibleFields.length
            ? ` Possible fields are ${possibleFields.map((pf) => pf)}`
            : ' This resource does not have any fields.'
        }`,
      );
    if (!operatorTypes[i[1]].includes(fieldTypes[i[0]]))
      throw new BadRequestException(
        `Field ${i[0].toUpperCase()} must be ${operatorTypes[i[1]]
          .toString()
          .replaceAll(',', ', ')} to perform ${i[1].toUpperCase()} operation.`,
      );
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
