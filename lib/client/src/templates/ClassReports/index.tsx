import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import Paginator from 'components/Paginator';
import ClassroomsSearch from 'components/ClassroomsSearch';

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
const ClassReportsTemplate = () => {
  const [filters, setFilters] =
    useState<ListClassroomsFilters>(INITIAL_FILTERS);

  const { data: profile } = useProfile();
  const { data: user } = useUser();
  const { data: schoolYear } = useSessionSchoolYear();

  const handleSearch = useCallback((searchData: ListClassroomsFilters) => {
    setFilters({ ...INITIAL_FILTERS, ...searchData });
  }, []);

  const classroomsFilters = useMemo(() => {
    const isTeacher = profile?.access_level?.code === 'teacher';
    const employee_id = isTeacher ? user?.employee?.id : undefined;

    return {
      school_id: profile?.school?.id,
      school_year_id: schoolYear?.id,
      employee_id,
      ...filters
    };
  }, [filters, profile, user, schoolYear]);

  const { data: classrooms } = useListClassrooms(classroomsFilters);

  return (
    <Base>
      <Heading>Relatório de aulas - selecione uma turma</Heading>

      <ClassroomsSearch handleSearch={handleSearch} />

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
              <Link href={`/auth/class-reports/${classroom.id}`} passHref>
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
    </Base>
  );
};

export default ClassReportsTemplate;
