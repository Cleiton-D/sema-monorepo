import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PlusCircle } from '@styled-icons/feather';
import { useSession } from 'next-auth/client';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import SchoolReportTable from 'components/SchoolReportTable';

import { useAccess } from 'hooks/AccessProvider';

import { Enroll } from 'models/Enroll';
import { School } from 'models/School';

import { useListEnrolls } from 'requests/queries/enrolls';

import { translateStatus } from 'utils/translateStatus';

import * as S from './styles';

export type EnrollsProps = {
  school?: School;
};

const Enrolls = ({ school }: EnrollsProps) => {
  const { enableAccess } = useAccess();

  const { query } = useRouter();

  const [session] = useSession();
  const { data: enrolls } = useListEnrolls(session, {
    school_id: school?.id
  });

  const canChangeEnroll = useMemo(
    () => enableAccess({ module: 'ENROLL', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Matrículas</Heading>
      {canChangeEnroll && school && (
        <S.AddButtonContainer>
          <Link href={`/enrolls/new?school_id=${query.school_id}`} passHref>
            <Button
              styleType="normal"
              size="medium"
              icon={<PlusCircle />}
              as="a"
            >
              Nova matrícula
            </Button>
          </Link>
        </S.AddButtonContainer>
      )}

      <S.TableSection>
        <S.SectionTitle>
          <h4>Matrículas</h4>
        </S.SectionTitle>
        <Table<Enroll> items={enrolls || []} keyExtractor={(value) => value.id}>
          <TableColumn label="Nome" tableKey="person.name">
            {({ id }: Enroll) => <SchoolReportTable enrollId={id} isMininal />}
          </TableColumn>
          <TableColumn
            label="Escola"
            tableKey="current_classroom.school.name"
          />
          <TableColumn label="Turma" tableKey="current_classroom.description" />
          <TableColumn
            label="Situação"
            tableKey="status"
            contentAlign="center"
            render={(status) => translateStatus(status)}
          />
          <TableColumn
            label="Ações"
            tableKey=""
            contentAlign="center"
            actionColumn
            render={(enroll: Enroll) => (
              <Link href={`/student/${enroll.id}`} passHref>
                <S.TableLink>Ver aluno</S.TableLink>
              </Link>
            )}
          />
        </Table>
      </S.TableSection>
    </Base>
  );
};

export default Enrolls;
