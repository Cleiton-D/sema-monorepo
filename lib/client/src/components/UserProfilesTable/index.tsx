import { useSession } from 'next-auth/client';
import { X } from '@styled-icons/feather';

import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { UserProfile } from 'models/UserProfile';

import { useListUserProfiles } from 'requests/queries/user-profile';
import { useDeleteUserProfile } from 'requests/mutations/user-profile';

import * as S from './styles';

type UserProfilesTableProps = {
  userId: string;
};
const UserProfilesTable = ({ userId }: UserProfilesTableProps) => {
  const [session] = useSession();
  const { data: userProfiles, refetch } = useListUserProfiles(session, {
    user_id: userId
  });

  const deleteUserProfile = useDeleteUserProfile();

  const handleDelete = async (userProfile: UserProfile) => {
    const confirm = window.confirm(
      `Deseja remover o acesso de ${userProfile.access_level?.description} na unidade ${userProfile.branch?.description} para este usuário?`
    );
    if (confirm) {
      await deleteUserProfile.mutateAsync({ id: userProfile.id });
      refetch();
    }
  };

  return (
    <Table<UserProfile>
      items={userProfiles || []}
      keyExtractor={(value) => value.id}
      minimal
    >
      <TableColumn label="Perfil" tableKey="access_level.description" />
      <TableColumn label="Unidade" tableKey="branch.description" />
      <TableColumn
        label="Ações"
        tableKey=""
        actionColumn
        contentAlign="center"
        module="USER_PROFILE"
        rule="WRITE"
        render={(userProfile: UserProfile) => (
          <S.ActionButton
            title="Remover acesso"
            onClick={() => handleDelete(userProfile)}
          >
            <X size={16} title="Remover acesso" />
          </S.ActionButton>
        )}
      />
    </Table>
  );
};

export default UserProfilesTable;
