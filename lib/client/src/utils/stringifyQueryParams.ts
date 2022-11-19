import { URLSearchParams } from 'url';

export const stringifyQueryParams = (
  query: Partial<Record<string, string | string[]>>
) => {
  const parsedQueryParams = Object.entries(query)
    .filter(([, value]) => typeof value !== 'undefined')
    .reduce((acc, [key, value]) => {
      return { ...acc, [key]: value };
    }, {});

  return new URLSearchParams(parsedQueryParams).toString();
};
