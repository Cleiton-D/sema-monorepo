import { useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import { PlusCircle, X, Edit, FileText } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import ClassroomModal, { ClassroomModalRef } from 'components/ClassroomModal';
import ClassroomEnrollsTable from 'components/ClassroomEnrollsTable';
import ClassroomsSearch from 'components/ClassroomsSearch';
import Paginator from 'components/Paginator';

import { useAccess } from 'hooks/AccessProvider';

import { Classroom } from 'models/Classroom';

import {
  ListClassroomsFilters,
  classroomsKeys,
  useListClassrooms
} from 'requests/queries/classrooms';
import { useDeleteClassroom } from 'requests/mutations/classroom';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

const INITIAL_FILTERS = {
  page: 1,
  size: 20
};
const Classrooms = () => {
  const [filters, setFilters] =
    useState<ListClassroomsFilters>(INITIAL_FILTERS);

  const modalRef = useRef<ClassroomModalRef>(null);

  const { enableAccess } = useAccess();

  const { query } = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const schoolId = useMemo(() => {
    if (query.school_id === 'me') {
      return session?.schoolId;
    }
    return query.school_id as string;
  }, [query, session]);

  const classroomsFilters = useMemo(() => {
    return {
      school_id: schoolId,
      school_year_id: session?.configs.school_year_id,
      ...filters
    };
  }, [filters, schoolId, session]);

  const { data: classrooms } = useListClassrooms(session, classroomsFilters);

  const deleteClassroomMutation = useDeleteClassroom({});

  const handleSearch = (searchData: ListClassroomsFilters) => {
    setFilters({ ...INITIAL_FILTERS, ...searchData });
  };

  const handleAddClassroom = () => {
    modalRef.current?.openModal();
  };

  const handleDeleteClassroom = async (classroom: Classroom) => {
    const confirmation = window.confirm(
      `Deseja fechar a turma ${classroom.description}?`
    );
    if (confirmation) {
      await deleteClassroomMutation.mutateAsync(classroom);
      queryClient.invalidateQueries(classroomsKeys.lists());
    }
  };

  const canChangeClassroom = useMemo(
    () => enableAccess({ module: 'CLASSROOM', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Turmas</Heading>
      {canChangeClassroom && schoolId && (
        <S.AddButtonContainer>
          <Button
            styleType="normal"
            size="medium"
            icon={<PlusCircle />}
            onClick={handleAddClassroom}
          >
            Adicionar Turma
          </Button>
        </S.AddButtonContainer>
      )}

      <ClassroomsSearch handleSearch={handleSearch} />

      <S.TableSection>
        <S.SectionTitle>
          <h4>Turmas</h4>
        </S.SectionTitle>
        <Table<Classroom>
          items={classrooms?.items || []}
          keyExtractor={(item) => item.id}
        >
          <TableColumn label="Descrição" tableKey="description">
            {(classroom) => <ClassroomEnrollsTable classroom={classroom} />}
          </TableColumn>

          {!session?.schoolId && (
            <TableColumn label="Escola" tableKey="school.name" />
          )}

          <TableColumn label="Série" tableKey="grade.description" />
          <TableColumn
            label="Período"
            tableKey="class_period.description"
            render={(class_period) => translateDescription(class_period)}
          />
          <TableColumn
            label="Lotação"
            tableKey="capacity"
            contentAlign="center"
          />
          <TableColumn
            label="Matriculas ativas"
            tableKey="enroll_count"
            contentAlign="center"
          />
          <TableColumn
            label="Links"
            tableKey=""
            contentAlign="center"
            actionColumn
            render={(classroom: Classroom) => (
              <Link
                href={{
                  pathname:
                    '/auth/school/[school_id]/classrooms/[classroom_id]',
                  query: {
                    school_id: classroom.school_id,
                    classroom_id: classroom.id
                  }
                }}
                passHref
              >
                <S.TableLink>Ver turma</S.TableLink>
              </Link>
            )}
          />
          <TableColumn
            label="Ações"
            tableKey=""
            contentAlign="center"
            actionColumn
            render={(classroom) => (
              <S.ActionButtons>
                <Link
                  href={{
                    pathname: '/auth/exports/school-reports',
                    query: {
                      classroom_id: classroom.id
                    }
                  }}
                  passHref
                >
                  <S.ActionButton color="primary" as="a" target="_blank">
                    <FileText title={`Imprimir boletim`} />
                  </S.ActionButton>
                </Link>

                {schoolId && (
                  <S.ActionButton
                    color="primary"
                    type="button"
                    title="Alterar turma"
                    onClick={() => modalRef.current?.openModal(classroom)}
                  >
                    <Edit title={`Alterar Turma`} size={20} />
                  </S.ActionButton>
                )}

                <S.ActionButton
                  color="red"
                  type="button"
                  title={`Fechar a turma ${classroom.description}`}
                  onClick={() => handleDeleteClassroom(classroom)}
                >
                  <X title={`Fechar a turma ${classroom.description}`} />
                </S.ActionButton>
              </S.ActionButtons>
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
      {schoolId && <ClassroomModal ref={modalRef} schoolId={schoolId} />}
    </Base>
  );
};

export default Classrooms;
