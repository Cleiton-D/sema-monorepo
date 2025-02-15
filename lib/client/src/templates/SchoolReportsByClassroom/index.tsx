import { useState, useMemo } from 'react';
import Link from 'next/link';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Paginator from 'components/Paginator';

import { Classroom } from 'models/Classroom';

import {
  ListClassroomsFilters,
  useListClassrooms
} from 'requests/queries/classrooms';
import {
  useProfile,
  useSessionSchoolYear,
  useUser
} from 'requests/queries/session';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

const INITIAL_FILTERS = {
  page: 1,
  size: 20
};
const SchoolReportsByClassroomTemplate = () => {
  const [filters, setFilters] =
    useState<ListClassroomsFilters>(INITIAL_FILTERS);

  const { data: user } = useUser();
  const { data: profile } = useProfile();
  const { data: schoolYear } = useSessionSchoolYear();

  const classroomsFilters = useMemo(() => {
    return {
      school_id: profile?.school?.id,
      employee_id: user?.employee?.id,
      school_year_id: schoolYear?.id,
      ...filters
    };
  }, [filters, user, profile, schoolYear]);
  const { data: classrooms } = useListClassrooms(classroomsFilters);

  return (
    (<Base>
      <Heading>Notas - selecione uma turma</Heading>
      <S.TableSection>
        <S.SectionTitle>
          <h4>Turmas</h4>
        </S.SectionTitle>
        <Table<Classroom>
          items={classrooms?.items || []}
          keyExtractor={(item) => item.id}
        >
          <TableColumn
            label="Descrição"
            tableKey="description"
            actionColumn
            render={(classroom: Classroom) => (
              <Link href={`/auth/school-reports/${classroom.id}`} passHref legacyBehavior>
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
        <S.PaginatorContainer>
          <Paginator
            total={classrooms?.total || 0}
            currentPage={classrooms?.page || 1}
            currentSize={classrooms?.size || 20}
            onChangeSize={(size: number) =>
              setFilters((current) => ({ ...current, size }))
            }
            onChangePage={(page: number) =>
              setFilters((current) => ({ ...current, page }))
            }
          />
        </S.PaginatorContainer>
      </S.TableSection>
    </Base>)
  );
};

export default SchoolReportsByClassroomTemplate;
