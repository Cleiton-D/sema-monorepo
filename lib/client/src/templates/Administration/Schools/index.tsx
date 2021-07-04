import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { PlusCircle } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Button from 'components/Button';

import { useAccess } from 'hooks/AccessProvider';

import { SchoolWithEnrollCount } from 'models/School';

import { useListSchools } from 'requests/queries/schools';

import * as S from './styles';

const Schools = () => {
  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data } = useListSchools(session);

  const { push } = useRouter();

  const handleNewSchool = () => {
    push('/administration/schools/new');
  };

  const canChangeSchools = useMemo(
    () => enableAccess({ module: 'SCHOOL', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Escolas</Heading>

      {canChangeSchools && (
        <S.AddButtonContainer>
          <Button
            styleType="normal"
            size="medium"
            icon={<PlusCircle />}
            onClick={handleNewSchool}
          >
            Adicionar Escola
          </Button>
        </S.AddButtonContainer>
      )}

      <S.TableSection>
        <S.SectionTitle>
          <h4>Escolas</h4>
        </S.SectionTitle>
        <Table<SchoolWithEnrollCount>
          items={data || []}
          keyExtractor={(item) => item.id}
        >
          <TableColumn
            label="Nome"
            tableKey=""
            actionColumn
            render={(school: SchoolWithEnrollCount) => (
              <Link href={`/school/${school.id}`} passHref>
                <S.TableLink>{school.name}</S.TableLink>
              </Link>
            )}
          />
          <TableColumn label="INEP" tableKey="inep_code" />
          <TableColumn
            label="Matrículas ativas"
            tableKey="enroll_count"
            contentAlign="center"
          />
        </Table>
      </S.TableSection>
    </Base>
  );
};

export default Schools;
