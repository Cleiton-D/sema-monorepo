import { useCallback } from 'react';

import ToastContent from 'components/ToastContent';

import { createUnstableApi, useMutation } from 'services/api';
import { MultigradeClassroom } from 'models/multigrade-classroom';

type CreateMultigradeClassroomPayload = {
  owner_id: string;
  classroom_id: string;
};

type AddMultigradeClassroomResponse<T> = T extends Array<T>
  ? MultigradeClassroom[]
  : MultigradeClassroom;

const addMultigradeClassroom = async <
  T extends
    | CreateMultigradeClassroomPayload
    | CreateMultigradeClassroomPayload[]
>(
  values: T
): Promise<AddMultigradeClassroomResponse<T>> => {
  const api = createUnstableApi();

  if (Array.isArray(values)) {
    const res = await Promise.all(
      values.map((value) => addMultigradeClassroom(value))
    );
    return res as AddMultigradeClassroomResponse<T>;
  }

  const { owner_id, ...data } = values as CreateMultigradeClassroomPayload;

  const { data: responseData } = await api.post(
    `/multigrades/${owner_id}/classrooms`,
    data
  );

  return responseData;
};

export function useAddMultigradeClassroom() {
  return useMutation(
    'add-multigrade-classroom',
    (payload) => addMultigradeClassroom(payload),
    {
      renderLoading: function render() {
        return <ToastContent showSpinner>Salvando ...</ToastContent>;
      },
      renderError: () => `Falha ao salvar alterações.`,
      renderSuccess: () => `Alterações realizadas com sucesso.`
    }
  );
}

export function useDeleteMultigradeClassroom() {
  const deleteMultigradeClassroom = useCallback(
    async (multigradeClassroom: MultigradeClassroom) => {
      const api = createUnstableApi();
      const { owner_id, id } = multigradeClassroom;
      if (!owner_id) return;

      await api.delete(`/multigrades/${owner_id}/classrooms/${id}`);
    },
    []
  );

  return useMutation('delete-multigrade-classroom', deleteMultigradeClassroom, {
    renderLoading: function render(multigradeClassroom) {
      return (
        <ToastContent showSpinner>
          Removendo {multigradeClassroom.classroom.description}...
        </ToastContent>
      );
    },
    renderError: (multigradeClassroom) =>
      `Falha ao remover ${multigradeClassroom.classroom.description}`,
    renderSuccess: (multigradeClassroom) =>
      `${multigradeClassroom.classroom.description} removido com sucesso.`
  });
}
