import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';

type Query = {
  key: string;
  fetcher: () => unknown | Promise<unknown>;
};

export default async function prefetchQuery(query: Query | Query[]) {
  const queryClient = new QueryClient();
  if (Array.isArray(query)) {
    await Promise.all(
      query.map(({ key, fetcher }) => queryClient.fetchQuery(key, fetcher))
    );
  } else {
    const { key, fetcher } = query;
    await queryClient.fetchQuery(key, fetcher);
  }

  return dehydrate(queryClient);
}
