import { useMemo } from 'react';
//import { Session } from 'next-auth';
//import { signOut } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import {
  MutationFunction,
  QueryClient,
  useMutation as useReactQueryMutation,
  useQueryClient
} from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import { toast, Flip, ToastContent } from 'react-toastify';

import { isServer } from 'utils/isServer';

import { SESSION_KEYS, getSession } from 'requests/queries/session';

const createApi = (session?: any) => {
  const jwt = session?.jwt;

  const api = axios.create({
    baseURL:
      isServer && process.env.APP_ENV === 'prod'
        ? process.env.SERVER_API_URL
        : process.env.NEXT_PUBLIC_API_URL,
    headers: {
      authorization: jwt ? `Bearer ${jwt}` : ''
    }
  });

  api.interceptors.request.use((config) => {
    const params = config.params || {};
    const newParams = Object.entries(params).reduce((acc, item) => {
      const [key, value] = item;
      const isTruthy =
        value !== '' && typeof value !== 'undefined' && value !== null;

      if (!isTruthy) return acc;

      return { ...acc, [key]: value };
    }, {});

    config.params = newParams;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status !== 401) return Promise.reject(error);
      if (!error.response?.data) return Promise.reject(error);
      if (error.response.data.status !== 'error') return Promise.reject(error);

      const isClient = typeof window !== 'undefined';
      if (isClient) {
        const isUnauthorized = String(error.response.data.message).match(
          /invalid jwt token/i
        );
        if (isUnauthorized) {
          //signOut({
          //  callbackUrl: '/sign-in',
          //  redirect: true
          //});

          return undefined;
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export function initializeApi(session: never) {
  return createApi(session);
}

export function useApi(session: never) {
  const store = useMemo(() => createApi(session), [session]);
  return store;
}

export type ProcessQueryDataFn = (oldData: any, newData: any) => any;

type UseMutationOptions = {
  linkedQueries?: Record<string, ProcessQueryDataFn>;
  renderLoading?: (data: any) => ToastContent;
  renderError?: (data: any, error: any) => ToastContent;
  renderSuccess?: (data: any) => ToastContent;
  onMutate?: () => void;
};

export function useMutation(
  key: string,
  mutationFn: MutationFunction<any, any>,
  options: UseMutationOptions = {}
) {
  const queryClient = useQueryClient();

  return useReactQueryMutation(key, mutationFn, {
    onMutate: async (data: any) => {
      const toastKey = options.renderLoading ? `${key}-${uuidv4()}` : undefined;
      if (toastKey && options.renderLoading) {
        toast.info(options.renderLoading(data), {
          position: toast.POSITION.TOP_RIGHT,
          toastId: toastKey,
          autoClose: false,
          closeButton: false
        });
      }

      const previousQueriesData: Record<string, any> = {};
      if (options.linkedQueries) {
        const promises = Object.entries(options.linkedQueries).map(
          async ([query, processQueryFn]) => {
            await queryClient.cancelQueries(query);

            const previousData = queryClient.getQueryData(query);
            queryClient.setQueryData(query, (old: any) =>
              processQueryFn(old, data)
            );

            previousQueriesData[query] = previousData;
          }
        );
        await Promise.all(promises);
      }

      options.onMutate && options.onMutate();

      return { previousQueriesData, toastKey };
    },
    onError: (err, data, context: any) => {
      const ctx = context || {};

      if (options.renderError) {
        const toastObj = {
          type: toast.TYPE.ERROR,
          render: options.renderError(data, err),
          autoClose: 3000
        };

        if (ctx.toastKey) {
          toast.update(ctx.toastKey, {
            ...toastObj,
            transition: Flip
          });
        } else {
          toast(toastObj as unknown as ToastContent);
        }
      } else if (ctx.toastKey) {
        toast.dismiss(ctx.toastKey);
      }

      Object.entries(ctx.previousQueriesData || {}).forEach(([key, value]) =>
        queryClient.setQueryData(key, value)
      );
    },
    onSuccess: (_, data, context) => {
      if (options.renderSuccess) {
        const toastObj = {
          type: toast.TYPE.SUCCESS,
          render: options.renderSuccess(data),
          autoClose: 3000
        };

        if (context.toastKey) {
          toast.update(context.toastKey, {
            ...toastObj,
            transition: Flip
          });
        } else {
          toast(toastObj as unknown as ToastContent);
        }
      } else if (context.toastKey) {
        toast.dismiss(context.toastKey);
      }
    },
    onSettled: () => {
      if (options.linkedQueries) {
        Object.keys(options.linkedQueries).forEach((query) =>
          queryClient.invalidateQueries(query)
        );
      }
    }
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchOnWindowFocus: false
    }
  }
});

const unstable__api = createApi();

if (!isServer) {
  unstable__api.interceptors.request.use(async (config) => {
    const session = queryClient.getQueryData<{ token?: string }>([
      SESSION_KEYS.all
    ]);
    let token = session?.token;

    const isSessionRequest =
      config.url === `${process.env.NEXT_PUBLIC_APP_URL}/api/session`;

    if (!token && !isSessionRequest) {
      const newSession = await getSession();
      queryClient.setQueryData([SESSION_KEYS.all], newSession);

      token = newSession?.token;
    }

    const authorization = token ? `Bearer ${token}` : '';
    config.headers.authorization = authorization;

    return config;
  });
}

export const createUnstableApi = (session?: AppSession) => {
  const authorization = session?.token ? `Bearer ${session.token}` : '';
  unstable__api.defaults.headers.authorization = authorization;

  return unstable__api;
};

type ApiError = {
  message: string;
  status: 'error';
};

const isApiError = (error: unknown): error is AxiosError<ApiError> => {
  return axios.isAxiosError(error);
};

export { unstable__api, isApiError };
