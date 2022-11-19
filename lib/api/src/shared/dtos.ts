export type PaginatedResponse<T> = {
  page: number;
  size: number;
  total: number;
  items: T[];
};
