import { useMemo } from 'react';
import { Session } from 'next-auth';
import axios from 'axios';
import {
  MutationFunction,
  QueryClient,
  useMutation as useReactQueryMutation,
  useQueryClient
} from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import { toast, Flip, ToastContent } from 'react-toastify';

const createApi = (session?: Session | null) => {
  const jwt = session?.jwt;

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      authorization: jwt ? `Bearer ${jwt}` : ''
    }
  });

  return api;
};

export function initializeApi(session?: Session | null) {
  return createApi(session);
}

export function useApi(session?: Session | null) {
  const store = useMemo(() => createApi(session), [session]);
  return store;
}

export type ProcessQueryDataFn = (oldData: any, newData: any) => any;

type UseMutationOptions = {
  linkedQueries?: Record<string, ProcessQueryDataFn>;
  renderLoading?: (data: any) => ToastContent;
  renderError?: (data: any) => ToastContent;
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
      if (options.renderError) {
        const toastObj = {
          type: toast.TYPE.ERROR,
          render: options.renderError(data),
          autoClose: 3000
        };

        if (context.toastKey) {
          toast.update(context.toastKey, {
            ...toastObj,
            transition: Flip
          });
        } else {
          toast(toastObj);
        }
      } else if (context.toastKey) {
        toast.dismiss(context.toastKey);
      }

      Object.entries(context.previousQueriesData).forEach(([key, value]) =>
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
          toast(toastObj);
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
      staleTime: 10000
    }
  }
});
