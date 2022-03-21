import Link from 'next/link';
import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';

import { Classroom } from 'models/Classroom';

import { useListClassrooms } from 'requests/queries/classrooms';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

const SchoolReportsByClassroomTemplate = () => {
  const { data: session } = useSession();

  const { data: classrooms } = useListClassrooms(session, {
    school_id: session?.schoolId,
    employee_id: session?.user.employeeId
  });

  return (
    <Base>
      <Heading>Notas - selecione uma turma</Heading>

      <S.TableSection>
        <S.SectionTitle>
          <h4>Turmas</h4>
        </S.SectionTitle>
        <Table<Classroom>
          items={classrooms || []}
          keyExtractor={(item) => item.id}
        >
          <TableColumn
            label="Descrição"
            tableKey="description"
            actionColumn
            render={(classroom: Classroom) => (
              <Link href={`/auth/school-reports/${classroom.id}`} passHref>
                <S.TableLink>{classroom.description}</S.TableLink>
              </Link>
            )}
          />
          <TableColumn
            label="Série"
            tableKey="grade"
            render={(grade) => grade.description}
          />
          <TableColumn
            label="Período"
            tableKey="class_period.description"
            render={(class_period) => translateDescription(class_period)}
          />
          <TableColumn
            label="Matriculas ativas"
            tableKey="enroll_count"
            contentAlign="center"
          />
        </Table>
      </S.TableSection>
    </Base>
  );
};

export default SchoolReportsByClassroomTemplate;
