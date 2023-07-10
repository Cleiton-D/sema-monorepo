import { useState, useMemo, useCallback } from 'react';
import { FileText } from '@styled-icons/feather';

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

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';
import {
  useProfile,
  useSessionSchoolYear,
  useUser
} from 'requests/queries/session';

const INITIAL_FILTERS = {
  page: 1,
  size: 20
};
const FinalReportsTemplate = () => {
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
      employee_id,
      school_year_id: schoolYear?.id,
      ...filters
    };
  }, [filters, profile, user, schoolYear]);

  const { data: classrooms } = useListClassrooms(classroomsFilters);

  return (
    <Base>
      <Heading>Relatório final</Heading>

      <ClassroomsSearch handleSearch={handleSearch} />

      <S.TableSection>
        <S.SectionTitle>
          <h4>Turmas</h4>
        </S.SectionTitle>
        <Table<Classroom>
          items={classrooms?.items || []}
          keyExtractor={(item) => item.id}
        >
          <TableColumn label="Descrição" tableKey="description" />
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
          <TableColumn
            label="Ações"
            tableKey=""
            contentAlign="center"
            actionColumn
            render={(classroom) => (
              <S.ActionButton
                title="Imprimir relatório final"
                target="_blank"
                href={`/api/reports/class-diary?classroom_id=${encodeURIComponent(
                  classroom.id
                )}`}
              >
                <FileText title="Imprimir relatório final" />
              </S.ActionButton>
            )}
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

export default FinalReportsTemplate;
