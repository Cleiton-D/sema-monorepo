import { useCallback } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import ToastContent from 'components/ToastContent';

import { initializeApi, useMutation } from 'services/api';
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
  session: Session | null,
  values: T
): Promise<AddMultigradeClassroomResponse<T>> => {
  const api = initializeApi(session);

  if (Array.isArray(values)) {
    const res = await Promise.all(
      values.map((value) => addMultigradeClassroom(session, value))
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
  const { data: session } = useSession();

  return useMutation(
    'add-multigrade-classroom',
    (payload) => addMultigradeClassroom(session, payload),
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
  const { data: session } = useSession();

  const deleteMultigradeClassroom = useCallback(
    async (multigradeClassroom: MultigradeClassroom) => {
      const api = initializeApi(session);
      const { owner_id, id } = multigradeClassroom;
      if (!owner_id) return;

      await api.delete(`/multigrades/${owner_id}/classrooms/${id}`);
    },
    [session]
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
