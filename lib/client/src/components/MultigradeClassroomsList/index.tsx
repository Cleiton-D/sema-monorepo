import { useMemo } from 'react';
import { useIsFetching, useQueryClient } from 'react-query';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { X } from '@styled-icons/feather';

import ListItem from 'components/ListItem';

import { MultigradeClassroom } from 'models/multigrade-classroom';

import { multigradesClassroomsKeys } from 'requests/queries/multigrade-classrooms';
import { useDeleteMultigradeClassroom } from 'requests/mutations/multigrade-classrooms';
import { multigradesKeys } from 'requests/queries/multigrades';

import { classroomsAtom } from 'store/atoms/create-multigrade';

import * as S from './styles';

type MultigradeClassroomsListProps = {
  multigradeId?: string;
};

const MultigradeClassroomsList = ({
  multigradeId
}: MultigradeClassroomsListProps): JSX.Element => {
  const queryClient = useQueryClient();

  const multigradesClassroomsQueryKey = useMemo(() => {
    return multigradesClassroomsKeys.list(
      JSON.stringify({ multigrade_id: multigradeId })
    );
  }, [multigradeId]);
  const isFetching = useIsFetching(multigradesClassroomsQueryKey);

  // const multigradesClassrooms = useAtomValue(
  //   multigradeClassroomsAtom(multigradeParams)
  // );
  const setMultigradesClassrooms = useUpdateAtom(classroomsAtom);

  const deleteMultigradeClassroom = useDeleteMultigradeClassroom();
  const handleRemove = async (multigradeClassroom: MultigradeClassroom) => {
    const confirmation = window.confirm(
      `Deseja remover a turma ${multigradeClassroom.classroom.description} do seriado?`
    );
    if (!confirmation) return;

    if (multigradeClassroom.owner_id) {
      await deleteMultigradeClassroom.mutateAsync(multigradeClassroom);
      queryClient.invalidateQueries(multigradesClassroomsKeys.lists());
      queryClient.invalidateQueries(multigradesKeys.all);
    }

    setMultigradesClassrooms((current) => {
      return current.filter(({ id }) => id !== multigradeClassroom.id);
    });
  };

  if (isFetching) {
    return <S.Message>Carregando...</S.Message>;
  }

  // if (!multigradesClassrooms.length) {
  //   return (
  //     <S.Message>
  //       Ainda não temos nenhuma turma vinculada a esse seriado, clique no botão
  //       &quot;Adicionar turma&quot;.
  //       <br /> (Caso o botão não apareça, selecione um período no campo ao lado)
  //     </S.Message>
  //   );
  // }

  return (
    <S.List>
      {/* {multigradesClassrooms.map((item) => (
        <ListItem key={item.id}>
          <S.ItemContent>
            <span>{item.classroom.description}</span>

            <S.ActionButton onClick={() => handleRemove(item)}>
              <X />
            </S.ActionButton>
          </S.ItemContent>
        </ListItem>
      ))} */}
    </S.List>
  );
};

export default MultigradeClassroomsList;
