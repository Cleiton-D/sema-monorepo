import { useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/client';
import { PlusSquare, X } from '@styled-icons/feather';

import AddEmployeeToProfileModal, {
  AddEmployeeToProfileModalRef
} from 'components/AddEmployeeToProfileModal';

import { Employee } from 'models/Employee';

import { useListEmployees } from 'requests/queries/employee';
import {
  useCreateUserProfile,
  useDeleteUserProfile
} from 'requests/mutations/user-profile';

import * as S from './styles';
import { useAccess } from 'hooks/AccessProvider';

type EmployeeSectionProps = {
  title: string;
  name: string;
  pluralName: string;
  buttonText: string;
  profileCode: string;
  branchId: string;
  moduleName?: string;
};
const EmployeeSection = ({
  title,
  name,
  pluralName,
  buttonText,
  profileCode,
  branchId,
  moduleName
}: EmployeeSectionProps) => {
  const modalRef = useRef<AddEmployeeToProfileModalRef>(null);

  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data: employees, isLoading, refetch } = useListEmployees(session, {
    accessCode: profileCode,
    branch_id: branchId
  });
  const createUserProfile = useCreateUserProfile();

  const deleteUserProfile = useDeleteUserProfile();

  const handleCreateUserProfile = useCallback(
    (employee: Employee) => {
      createUserProfile
        .mutateAsync({
          user_id: employee.user_id,
          branch_id: branchId,
          accessCode: profileCode
        })
        .then(() => refetch());
    },
    [branchId, createUserProfile, profileCode, refetch]
  );

  const handleDelete = useCallback(
    async (employee: Employee) => {
      const confirmation = window.confirm(
        `Deseja remover o/a ${name} ${employee.person.name}?`
      );
      if (confirmation) {
        await deleteUserProfile.mutateAsync({
          user_id: employee.user_id,
          branch_id: branchId,
          accessCode: profileCode
        });
        refetch();
      }
    },
    [deleteUserProfile, name, profileCode, branchId, refetch]
  );

  const canEditEmployees = useMemo(() => {
    if (!moduleName) return true;

    return enableAccess({ module: moduleName, rule: 'WRITE' });
  }, [enableAccess, moduleName]);

  return (
    <S.Wrapper>
      <S.Title>
        <h2>{title}</h2>
        {canEditEmployees && (
          <S.HeaderActionButton onClick={() => modalRef.current?.openModal()}>
            {buttonText} <PlusSquare size={16} />
          </S.HeaderActionButton>
        )}
      </S.Title>
      {employees ? (
        <>
          {employees.length > 0 ? (
            <S.List>
              {employees.map((employee) => (
                <li key={employee.id}>
                  <span>{employee.person.name}</span>

                  {canEditEmployees && (
                    <S.ActionButton onClick={() => handleDelete(employee)}>
                      <X size={16} title="Remover vínculo" />
                    </S.ActionButton>
                  )}
                </li>
              ))}
            </S.List>
          ) : (
            <S.Message>
              {canEditEmployees
                ? `Nenhum ${name} cadastrado, clique no botão ${buttonText} para adicionar ${pluralName}.`
                : `Nenhum ${name} cadastrado.`}
            </S.Message>
          )}
        </>
      ) : (
        <>
          {isLoading ? (
            <S.Message>Carregando...</S.Message>
          ) : (
            <S.Message>Não foi possível carregar as disciplinas</S.Message>
          )}
        </>
      )}

      <AddEmployeeToProfileModal
        onSubmit={handleCreateUserProfile}
        title={buttonText}
        ref={modalRef}
      />
    </S.Wrapper>
  );
};

export default EmployeeSection;
