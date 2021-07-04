import { useRef } from 'react';
import { useSession } from 'next-auth/client';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import ClassroomTeachersTable from 'components/ClassroomTeachersTable';
import LinkClassroomTeacherSchoolSubjectsModal, {
  LinkClassroomTeacherSchoolSubjectsModalRef
} from 'components/LinkClassroomTeacherSchoolSubjectsModal';

import { School } from 'models/School';
import { Classroom } from 'models/Classroom';

import { useListClassrooms } from 'requests/queries/classrooms';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

export type ClassroomTeacherProps = {
  school: School;
};

const ClassroomTeacher = ({ school }: ClassroomTeacherProps) => {
  const modalRef = useRef<LinkClassroomTeacherSchoolSubjectsModalRef>(null);

  const [session] = useSession();
  const { data: classrooms } = useListClassrooms(session, {
    school_id: school.id
  });

  return (
    <Base>
      <Heading>Turmas x Professores</Heading>
      <S.TableSection>
        <S.SectionTitle>
          <h4>Turmas</h4>
        </S.SectionTitle>
        <Table<Classroom>
          items={classrooms || []}
          keyExtractor={(value) => value.id}
        >
          <TableColumn label="Descrição" tableKey="description">
            {(classroom: Classroom) => (
              <ClassroomTeachersTable classroom={classroom} />
            )}
          </TableColumn>
          <TableColumn
            label="Período"
            tableKey="class_period"
            render={(class_period) =>
              translateDescription(class_period.description)
            }
          />
          <TableColumn
            label="Matriculas ativas"
            tableKey="enroll_count"
            contentAlign="center"
          />
          <TableColumn
            label="Ações"
            tableKey=""
            contentAlign="center"
            actionColumn
            module="CLASSROOM_TEACHER"
            rule="WRITE"
            render={(classroom: Classroom) => (
              <S.OpenModalButton
                onClick={() => modalRef.current?.openModal(classroom)}
              >
                Alterar professores
              </S.OpenModalButton>
            )}
          />
        </Table>
      </S.TableSection>
      <LinkClassroomTeacherSchoolSubjectsModal ref={modalRef} />
    </Base>
  );
};

export default ClassroomTeacher;
