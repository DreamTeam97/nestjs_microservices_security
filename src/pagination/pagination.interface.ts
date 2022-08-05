import { ENUM_PAGINATION_AVAILABLE_SORT_TYPE } from './pagination.constant';
export interface IDatabaseFindOneOptions {
  populate?: Record<string, boolean>;
}

export interface IPaginationOptions {
  limit: number;
  skip: number;
  sort?: Record<string, ENUM_PAGINATION_AVAILABLE_SORT_TYPE>;
}
