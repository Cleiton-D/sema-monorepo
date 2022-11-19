export type PaginatedHttpResponse<T> = {
  total: number;
  page: number;
  size: number;
  items: Array<T>;
};
