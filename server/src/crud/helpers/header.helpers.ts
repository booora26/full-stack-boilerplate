export const generatePagnationHeaders = (
  currentPageURI: string,
  page: string,
  limit: string,
  itemsCount: number,
) => {
  if (!limit) return { 'X-Total-Count': itemsCount };
  const nextPage = Number(page) + 1;
  const previousPage = Number(page) - 1;
  const lastPage = Number((itemsCount / Number(limit)).toFixed(0));

  const nextPageURI = currentPageURI.replace(
    `page=${page}`,
    `page=${nextPage}`,
  );
  console.log('next', nextPageURI, nextPage, currentPageURI);
  const previousPageURI = currentPageURI.replace(
    `page=${page}`,
    `page=${previousPage}`,
  );
  const lastPageURI = currentPageURI.replace(
    `page=${page}`,
    `page=${lastPage}`,
  );
  const firstPageURI = currentPageURI.replace(`page=${page}`, `page=1`);

  const headerLinks = [
    `<${firstPageURI}>;rel=first`,
    `<${lastPageURI}>;rel=last`,
  ];

  nextPage < lastPage ? headerLinks.push(`<${nextPageURI}>;rel=next`) : '';
  previousPage > 0 ? headerLinks.push(`<${previousPageURI}>;rel=prev`) : '';
  return {
    Link: headerLinks.join(','),
    'Pagination-Count': lastPage > 0 ? lastPage : 1,
    'Pagination-Page': page ? page : 1,
    'Pagination-Limit': limit,
    'X-Total-Count': itemsCount,
  };
};

export const generateLocationHeader = (url: string, id: number) => {
  return { Location: `${url}/${id}` };
};
