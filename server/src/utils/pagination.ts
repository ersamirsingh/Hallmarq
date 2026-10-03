import { HttpError } from './httpError.js';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
  buildMeta: (total: number) => {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export const parsePagination = (rawPage: unknown, rawLimit: unknown): PaginationParams => {
  let page = 1;
  let limit = 10;

  if (rawPage !== undefined && rawPage !== null && rawPage !== '') {
    const parsedPage = Number(rawPage);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      throw new HttpError(400, 'Page must be an integer greater than or equal to 1');
    }
    page = parsedPage;
  }

  if (rawLimit !== undefined && rawLimit !== null && rawLimit !== '') {
    const parsedLimit = Number(rawLimit);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      throw new HttpError(400, 'Limit must be an integer greater than or equal to 1');
    }
    limit = Math.min(parsedLimit, 50);
  }

  const skip = (page - 1) * limit;
  const take = limit;

  return {
    page,
    limit,
    skip,
    take,
    buildMeta: (total: number) => {
      const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
      const hasNext = page < totalPages;
      return {
        page,
        limit,
        total,
        totalPages,
        hasNext
      };
    }
  };
};
