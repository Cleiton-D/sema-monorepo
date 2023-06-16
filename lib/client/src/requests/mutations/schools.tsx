import { useCallback } from 'react';

import { createUnstableApi, useMutation } from 'services/api';

import ToastContent from 'components/ToastContent';

import { School } from 'models/School';

export function useAddSchoolMutation() {
  const addSchool = useCallback(async (values: any) => {
    const api = createUnstableApi();
    return api.post('/schools', values);
  }, []);

  return useMutation('add-school', addSchool, {
    renderLoading: function render(newSchool) {
      return (
        <ToastContent showSpinner>
          Salvando escola {newSchool.name}...
        </ToastContent>
      );
    },
    renderError: (newSchool) => `Falha ao inserir escola ${newSchool.name}`,
    renderSuccess: (newSchool) => `${newSchool.name} inserida com sucesso`
  });
}

type AddressData = {
  street: string;
  house_number: string;
  city: string;
  district: string;
  region: string;
};

type ContactData = {
  description: string;
  type: string;
};

type UpdateSchoolResquest = {
  school_id: string;
  name?: string;
  inep_code?: string;
  address?: AddressData;
  contacts?: ContactData[];
  director_id?: string;
  vice_director_id?: string;
};

export function useUpdateSchool(school: School, onMutate?: () => void) {
  const updateSchool = useCallback(
    async (values: UpdateSchoolResquest) => {
      const api = createUnstableApi();
      return api
        .put<School>(`/schools/${school.id}`, values)
        .then((response) => response.data);
    },
    [school]
  );

  return useMutation('update-school', updateSchool, {
    onMutate,
    renderLoading: function render() {
      return <ToastContent showSpinner>Salvando alterações...</ToastContent>;
    },
    renderError: () =>
      `Não foi possível atualizar as informações da escola ${school.name}.`,
    renderSuccess: () => `Informações atualizadas com sucesso.`
  });
}
