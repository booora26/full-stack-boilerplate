import { ManyToOne } from 'typeorm';

export const getEntityRelations = (metadata) => {
  const oneToMany = metadata.oneToManyRelations.map((r) => r.propertyName);

  const manyToOne = metadata.manyToOneRelations.map((r) => r.propertyName);

  const manyToMany = metadata.manyToManyRelations.map((r) => r.propertyName);

  return { oneToMany, manyToOne, manyToMany };
};

export const createRelationEntities = (metadata, newEntity): any => {
  const { oneToMany, manyToMany } = getEntityRelations(metadata);

  const allRelations = {};

  if (oneToMany || manyToMany) {
    const relations = getManyRelationEntities(metadata, newEntity);
    Object.assign(allRelations, { ...relations });
  }

  return allRelations;
};

export const getManyRelationEntities = (metadata, newEntity) => {
  const existingRelations = [];
  metadata.relations.forEach((r) => {
    if (newEntity[r.propertyName]) existingRelations.push(r.propertyName);
  });

  const newRelations = {};

  if (existingRelations)
    existingRelations.forEach((r) => {
      const collection = [];
      newEntity[r].forEach((value) => {
        const entity = metadata.relations[0].inverseEntityMetadata.create();
        entity.id = value;
        collection.push(entity);
      });
      Object.assign(newRelations, { [r]: collection });
    });

  return newRelations;
};
