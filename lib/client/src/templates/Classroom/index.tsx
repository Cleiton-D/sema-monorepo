import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Printer } from '@styled-icons/feather';

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

  const { data: classroom } = useShowClassroom({
    id: query.classroom_id as string
  });

  const { data: enrollClassrooms = [] } = useListEnrollClassrooms({
    classroom_id: query.classroom_id as string
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

          <Link
            href={{
              pathname: '/auth/exports/nominal-relation',
              query: {
                classroom_id: classroom?.id
              }
            }}
            passHref
          >
            <S.LightLink target="_blank">
              <Printer
                size={18}
                style={{ strokeWidth: 2, marginRight: '0.5rem' }}
              />
              Imprimir
            </S.LightLink>
          </Link>
        </S.SectionTitle>
        {classroom && (
          <ClassroomStudentNominalRelation classroomId={classroom.id} />
        )}
      </S.TableSection>

      <S.TableSection>
        <S.SectionTitle>
          <h4>Quadro de notas</h4>

          <Link
            href={{
              pathname: '/auth/exports/school-reports',
              query: {
                classroom_id: classroom?.id
              }
            }}
            passHref
          >
            <S.LightLink target="_blank">
              <Printer
                size={18}
                style={{ strokeWidth: 2, marginRight: '0.5rem' }}
              />
              Imprimir boletim
            </S.LightLink>
          </Link>
        </S.SectionTitle>

        <EnrollsTable enrolls={enrolls || []} />
      </S.TableSection>

      <S.TableSection>
        <S.SectionTitle>
          <h4>Total geral de faltas</h4>
        </S.SectionTitle>

        {classroom && <FinalAttendancesTable classroomId={classroom.id} />}
      </S.TableSection>
    </Base>
  );
};

export default ClassroomTemplate;
