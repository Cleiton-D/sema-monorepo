import { useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/client';
import { v4 as uuidv4 } from 'uuid';

import ToastContent from 'components/ToastContent';

import { AccessModule } from 'models/AccessModule';
import { AccessLevel } from 'models/AccessLevel';

import { initializeApi, useMutation } from 'services/api';

type MutateAcessModulesFormData = Array<{
  access_level_id: string;
  module_id: string;
  module_name: string;
  read: boolean;
  write: boolean;
}>;

const queryMutateAccessModule = (
  oldItems: AccessModule[],
  newItems: MutateAcessModulesFormData
) => {
  if (!oldItems) return oldItems;

  const oldItemsObj = oldItems.reduce<Record<string, AccessModule>>(
    (acc, item) => {
      const key = `${item.app_module_id}-${item.access_level_id}`;
      return { ...acc, [key]: item };
    },
    {}
  );

  const newItemsObj = newItems.reduce((acc, item) => {
    const key = `${item.module_id}-${item.access_level_id}`;
    const accessModule = oldItemsObj[key] || {};

    return {
      ...acc,
      [key]: {
        ...accessModule,
        id: accessModule.id || uuidv4(),
        app_module: {
          description: item.module_name
        },
        read: item.read,
        write: item.write,
        disabled: true
      }
    };
  }, {});

  return Object.values({ ...oldItemsObj, ...newItemsObj });
};

export function useMutateAccessModules(accessLevel?: AccessLevel) {
  const [session] = useSession();

  const queryFilter = useMemo(() => ({ access_level_id: accessLevel?.id }), [
    accessLevel
  ]);

  const mutateAcessModules = useCallback(
    async (values: MutateAcessModulesFormData) => {
      const api = initializeApi(session);

      const requestData = values.map(
        ({ access_level_id, module_id, read, write }) => ({
          access_level_id,
          module_id,
          read,
          write
        })
      );

      const { data: responseData } = await api.post<AccessModule>(
        '/app/access-modules',
        requestData
      );

      return responseData;
    },
    [session]
  );

  return useMutation('mutate-access-modules', mutateAcessModules, {
    linkedQueries: {
      [`list-access-modules-${JSON.stringify(
        queryFilter
      )}`]: queryMutateAccessModule
    },
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}

export function useDeleteAccessModule() {
  const [session] = useSession();

  const deleteAcessModule = useCallback(
    async (accessModule: AccessModule) => {
      const api = initializeApi(session);

      await api.delete(`/app/access-modules/${accessModule.id}`);
    },
    [session]
  );

  return useMutation('delete-access-module', deleteAcessModule, {
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando...</ToastContent>;
    },
    renderError: () => `Falha ao salvar alterações.`,
    renderSuccess: () => `Alterações realizadas com sucesso.`
  });
}
