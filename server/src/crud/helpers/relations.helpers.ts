export const getEntityRelations = (metadata) => {
  return metadata.relations.map((r) => r.propertyName);
};
