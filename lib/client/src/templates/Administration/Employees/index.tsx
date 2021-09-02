import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { PlusCircle, Edit3 } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Button from 'components/Button';

import { useAccess } from 'hooks/AccessProvider';

import { Employee } from 'models/Employee';

import { useListEmployees } from 'requests/queries/employee';

import * as S from './styles';

const Employees = () => {
  const { enableAccess } = useAccess();

  const router = useRouter();
  const [session] = useSession();
  const { data: employees } = useListEmployees(session);

  const canEditEmployees = useMemo(
    () => enableAccess({ module: 'EMPLOYEE', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Servidores</Heading>
      {canEditEmployees && (
        <S.AddButtonContainer>
          <Link href={`/administration/employees/new`} passHref>
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
          <TableColumn label="Nome" tableKey="person.name" />
          <TableColumn label="PIS / PASEP" tableKey="pis_pasep" />
          <TableColumn label="Grau de Instrução" tableKey="education_level" />
          <TableColumn label="Grau de Instrução" tableKey="education_level" />
          <TableColumn
            label="Ações"
            tableKey="id"
            contentAlign="center"
            module="EMPLOYEE"
            rule="WRITE"
            actionColumn
            render={(employee: Employee) => (
              <S.ActionButton
                color="primary"
                type="button"
                title={`Editar ${employee.person.name}`}
                onClick={() =>
                  router.push(`/administration/employees/edit/${employee.id}`)
                }
              >
                <Edit3 size={20} />
              </S.ActionButton>
            )}
          />
        </Table>
      </S.TableSection>
    </Base>
  );
};

export default Employees;
