import { useMemo, useRef } from 'react';
import { useSession } from 'next-auth/client';
import { PlusCircle, PlusSquare, X } from '@styled-icons/feather';
import { useQuery } from 'react-query';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import AddUserModal, { ModalRef } from 'components/AddUserModal';
import UserProfilesTable from 'components/UserProfilesTable';
import CreateUserProfileModal, {
  CreateUserProfileModalRef
} from 'components/CreateUserProfileModal';

import { useAccess } from 'hooks/AccessProvider';

import { FormattedUser, User } from 'models/User';

import { listUsers } from 'requests/queries/users';
import { useDeleteUserMutation } from 'requests/mutations/users';

import * as S from './styles';

const Users = () => {
  const modalRef = useRef<ModalRef>(null);
  const userProfileModalRef = useRef<CreateUserProfileModalRef>(null);

  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data } = useQuery<FormattedUser[]>('get-users', () =>
    listUsers(session)
  );
  const mutation = useDeleteUserMutation(session);

  const handleOpenModal = () => {
    modalRef.current?.openModal();
  };

  const canChangeUsers = useMemo(
    () => enableAccess({ module: 'USER', rule: 'WRITE' }),
    [enableAccess]
  );
  const canChangeUserProfiles = useMemo(
    () => enableAccess({ module: 'USER_PROFILE', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Usuários</Heading>
      {canChangeUsers && (
        <S.AddButtonContainer>
          <Button
            styleType="normal"
            size="medium"
            icon={<PlusCircle />}
            onClick={handleOpenModal}
          >
            Adicionar Usuário
          </Button>
        </S.AddButtonContainer>
      )}

      <S.TableSection>
        <S.SectionTitle>
          <h4>Usuários</h4>
        </S.SectionTitle>

        <Table<FormattedUser>
          items={data || []}
          keyExtractor={(value) => value.id}
        >
          <TableColumn label="Nome" tableKey="username">
            {({ id }: FormattedUser) => <UserProfilesTable userId={id} />}
          </TableColumn>

          <TableColumn label="Login" tableKey="login" />
          <TableColumn
            label="Data de Criação"
            tableKey="formattedCreatedAt"
            contentAlign="center"
          />
          <TableColumn
            label="Data da última atualização"
            tableKey="formattedUpdatedAt"
            contentAlign="center"
          />
          <TableColumn
            label="Ações"
            tableKey="id"
            contentAlign="center"
            actionColumn
            render={(user: User) => (
              <S.ActionButtonsContainer>
                {canChangeUserProfiles && (
                  <S.ActionButton
                    color="primary"
                    type="button"
                    title={`Adicionar perfil`}
                    onClick={() => userProfileModalRef.current?.openModal(user)}
                  >
                    <PlusSquare size={20} />
                  </S.ActionButton>
                )}

                {canChangeUsers && (
                  <S.ActionButton
                    color="red"
                    type="button"
                    title={`Remover ${user.username}`}
                    onClick={() => mutation.mutate(user)}
                  >
                    <X size={20} />
                  </S.ActionButton>
                )}
              </S.ActionButtonsContainer>
            )}
          />
        </Table>
      </S.TableSection>
      <AddUserModal ref={modalRef} />
      <CreateUserProfileModal ref={userProfileModalRef} />
    </Base>
  );
};

export default Users;
