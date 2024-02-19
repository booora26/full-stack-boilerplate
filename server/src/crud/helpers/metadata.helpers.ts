import { Request } from 'express';
import { EntityMetadata } from 'typeorm';

export const generateMetadataLinks = (
  metadata: EntityMetadata,
  req: Request,
) => {
  const relations = metadata.ownRelations.map((r) => r.propertyName);

  const { protocol, headers, path } = req;
  const currentPageURI = `${protocol}://${headers.host}${path}`;

  const links = { self: currentPageURI };
  relations.forEach((rel) =>
    Object.assign(links, { [rel]: `${currentPageURI}/${rel}` }),
  );

  return { _links: links };
};
export const generateSelfLink = (req: Request, id: number) => {
  const { protocol, headers, path } = req;
  const currentPageURI = `${protocol}://${headers.host}${path}/${id}`;

  const links = { self: currentPageURI };

  return { _links: links };
};
