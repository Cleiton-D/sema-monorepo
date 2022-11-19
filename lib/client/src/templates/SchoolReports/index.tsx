import { useSession } from 'next-auth/react';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import EnrollSchoolReports from 'components/EnrollSchoolReports';

import { Enroll } from 'models/Enroll';

import { useListEnrolls } from 'requests/queries/enrolls';

import { translateStatus } from 'utils/translateStatus';
import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

const SchoolReportsTemplate = () => {
  const { data: session } = useSession();

  const { data: enrolls } = useListEnrolls(session);

  // const { data: classrooms } = useListClassrooms(session, {
  //   school_id: session?.schoolId,
  //   employee_id: session?.user.employeeId
  // });

  return (
    <Base>
      <Heading>Notas - selecione uma turma</Heading>

      <S.TableSection>
        <S.SectionTitle>
          <h4>Turmas</h4>
        </S.SectionTitle>
        <Table<Enroll>
          items={enrolls?.items || []}
          keyExtractor={(item) => item.id}
        >
          <TableColumn label="Nome" tableKey="student.name">
            {(enroll) => <EnrollSchoolReports enroll={enroll} />}
          </TableColumn>
          <TableColumn
            label="Escola"
            tableKey="current_classroom.school.name"
          />
          <TableColumn label="Série" tableKey="grade.description" />
          <TableColumn label="Turma" tableKey="current_classroom.description" />
          <TableColumn
            label="Período"
            tableKey="current_classroom.class_period.description"
            render={translateDescription}
          />
          <TableColumn
            label="Situação"
            tableKey="status"
            contentAlign="center"
            render={(status) => translateStatus(status)}
          />
        </Table>
      </S.TableSection>
    </Base>
  );
};

export default SchoolReportsTemplate;
