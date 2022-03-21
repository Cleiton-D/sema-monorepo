import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import ClassroomStudentNominalRelation from 'components/ClassroomStudentNominalRelation';
import EnrollsTable from 'components/EnrollsTable';
import FinalAttendancesTable from 'components/FinalAttendancesTable';

import { useShowClassroom } from 'requests/queries/classrooms';
import { useListEnrollClassrooms } from 'requests/queries/enroll-classrooms';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

const ClassroomTemplate = () => {
  const { query } = useRouter();
  const { data: session } = useSession();

  const { data: classroom } = useShowClassroom(session, {
    id: query.classroom_id as string
  });

  const { data: enrollClassrooms = [] } = useListEnrollClassrooms(session, {
    classroom_id: classroom?.id
  });

  const enrolls = useMemo(() => {
    return enrollClassrooms.map(({ enroll, status }) => ({
      ...enroll,
      status
    }));
  }, [enrollClassrooms]);

  return (
    <Base>
      <Heading>Detalhes da turma</Heading>
      <S.Wrapper>
        <div>
          <S.ClassroomDescription size="md" color="primary">
            {classroom?.description}
          </S.ClassroomDescription>
          <S.LightText>Escola: {classroom?.school?.name}</S.LightText>
        </div>
        <S.Details>
          <S.Grid>
            <S.GridItem>
              <strong>Série</strong>
              <span>{classroom?.grade?.description}</span>
            </S.GridItem>
            <S.GridItem>
              <strong>Turno</strong>
              <span>
                {classroom?.class_period &&
                  translateDescription(classroom.class_period.description)}
              </span>
            </S.GridItem>
            <S.GridItem>
              <strong>Ano letivo</strong>
              <span>{classroom?.school_year?.reference_year}</span>
            </S.GridItem>
          </S.Grid>
        </S.Details>
      </S.Wrapper>
      <S.TableSection>
        <S.SectionTitle>
          <h4>Relação Nominal</h4>
        </S.SectionTitle>
        <ClassroomStudentNominalRelation classroomId={classroom?.id} />
      </S.TableSection>

      <S.TableSection>
        <S.SectionTitle>
          <h4>Quadro de notas</h4>
        </S.SectionTitle>

        <EnrollsTable enrolls={enrolls || []} />
      </S.TableSection>

      <S.TableSection>
        <S.SectionTitle>
          <h4>Total geral de faltas</h4>
        </S.SectionTitle>

        <FinalAttendancesTable classroomId={classroom?.id} />
      </S.TableSection>
    </Base>
  );
};

export default ClassroomTemplate;
