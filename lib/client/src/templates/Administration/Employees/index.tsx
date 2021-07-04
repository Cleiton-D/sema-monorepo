import { useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { PlusCircle } from '@styled-icons/feather';

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
        </Table>
      </S.TableSection>
    </Base>
  );
};

export default Employees;
