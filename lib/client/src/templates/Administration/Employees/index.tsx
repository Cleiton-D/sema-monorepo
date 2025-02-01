import { useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PlusCircle, Edit, X, PlusSquare } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Button from 'components/Button';
import UserProfilesTable from 'components/UserProfilesTable';
import CreateEmployeeUserProfileModal, {
  CreateEmployeeUserProfileModalRef
} from 'components/CreateEmployeeUserProfileModal';

import { useAccess } from 'hooks/AccessProvider';

import { Employee } from 'models/Employee';

import { useListEmployees } from 'requests/queries/employee';
import { useDeleteEmployee } from 'requests/mutations/employee';

import * as S from './styles';

const Employees = () => {
  const { enableAccess } = useAccess();

  const employeeUserProfileModalRef =
    useRef<CreateEmployeeUserProfileModalRef>(null);

  const router = useRouter();
  const { data: employees, refetch } = useListEmployees();

  const deleteEmployee = useDeleteEmployee();

  const handleDelete = async (employee: Employee) => {
    const confirmation = window.confirm(
      `Deseja remover o servidor ${employee.name}?`
    );
    if (confirmation) {
      await deleteEmployee.mutateAsync(employee);
      refetch();
    }
  };

  const canEditEmployees = useMemo(
    () => enableAccess({ module: 'EMPLOYEE', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    (<Base>
      <Heading>Servidores</Heading>
      {canEditEmployees && (
        <S.AddButtonContainer>
          <Link href={`/auth/administration/employees/new`} passHref legacyBehavior>
            <Button
              styleType="normal"
              size="medium"
              icon={<PlusCircle />}
              as="a"
            >
              Adicionar servidor
            </Button>
          </Link>
        </S.AddButtonContainer>
      )}
      <S.TableSection>
        <S.SectionTitle>
          <h4>Servidores</h4>
        </S.SectionTitle>
        <Table<Employee>
          items={employees || []}
          keyExtractor={(value) => value.id}
        >
          <TableColumn label="Nome" tableKey="name">
            {({ user_id }: Employee) => <UserProfilesTable userId={user_id} />}
          </TableColumn>
          <TableColumn label="Grau de Instrução" tableKey="education_level" />
          <TableColumn label="CPF" tableKey="cpf" />
          <TableColumn label="PIS / PASEP" tableKey="pis_pasep" />
          <TableColumn
            label="Ações"
            tableKey="id"
            contentAlign="center"
            module="EMPLOYEE"
            rule="WRITE"
            actionColumn
            render={(employee: Employee) => (
              <S.ActionButtons>
                <S.ActionButton
                  color="primary"
                  type="button"
                  title="Adicionar perfil de acesso"
                  onClick={() =>
                    employeeUserProfileModalRef.current?.openModal(employee)
                  }
                >
                  <PlusSquare size={20} />
                </S.ActionButton>
                <S.ActionButton
                  color="primary"
                  type="button"
                  title={`Alterar servidor`}
                  onClick={() =>
                    router.push(
                      `/auth/administration/employees/edit/${employee.id}`
                    )
                  }
                >
                  <Edit title={`Alterar servidor`} size={20} />
                </S.ActionButton>
                <S.ActionButton
                  color="red"
                  type="button"
                  title={`Excluir a servidor`}
                  onClick={() => handleDelete(employee)}
                >
                  <X size={20} />
                </S.ActionButton>
              </S.ActionButtons>
            )}
          />
        </Table>
      </S.TableSection>
      <CreateEmployeeUserProfileModal ref={employeeUserProfileModalRef} />
    </Base>)
  );
};

export default Employees;
