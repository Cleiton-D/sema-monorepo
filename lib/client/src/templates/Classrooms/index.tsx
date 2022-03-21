import { useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { PlusCircle, X, Edit } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import ClassroomModal, { ClassroomModalRef } from 'components/ClassroomModal';
import ClassroomEnrollsTable from 'components/ClassroomEnrollsTable';
import ClassroomsSearch from 'components/ClassroomsSearch';

import { useAccess } from 'hooks/AccessProvider';

import { Classroom } from 'models/Classroom';

import {
  ListClassroomsFilters,
  useListClassrooms
} from 'requests/queries/classrooms';
import { useDeleteClassroom } from 'requests/mutations/classroom';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

const Classrooms = () => {
  const [filters, setFilters] = useState<ListClassroomsFilters>({});

  const modalRef = useRef<ClassroomModalRef>(null);

  const { enableAccess } = useAccess();

  const { query } = useRouter();
  const { data: session } = useSession();

  const schoolId = useMemo(() => {
    if (query.school_id === 'me') {
      return session?.schoolId;
    }
    return query.school_id as string;
  }, [query, session]);

  const classroomsFilters = useMemo(() => {
    return {
      school_id: schoolId,
      ...filters
    };
  }, [filters, schoolId]);

  const {
    data: classrooms,
    key,
    queryAddMutation,
    queryRemoveMutation
  } = useListClassrooms(session, classroomsFilters);

  const deleteClassroomMutation = useDeleteClassroom({
    [key]: queryRemoveMutation
  });

  const handleAddClassroom = () => {
    modalRef.current?.openModal();
  };

  const handleDeleteClassroom = (classroom: Classroom) => {
    const confirmation = window.confirm(
      `Deseja fechar a turma ${classroom.description}?`
    );
    if (confirmation) {
      deleteClassroomMutation.mutate(classroom);
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

      <ClassroomsSearch handleSearch={setFilters} />

      <S.TableSection>
        <S.SectionTitle>
          <h4>Turmas</h4>
        </S.SectionTitle>
        <Table<Classroom>
          items={classrooms || []}
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
                {schoolId && (
                  <S.ActionButton
                    color="primary"
                    type="button"
                    title="Alterar turma"
                    onClick={() => modalRef.current?.openModal(classroom)}
                  >
                    <Edit title={`Alterar servidor`} size={20} />
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
      </S.TableSection>
      {schoolId && (
        <ClassroomModal
          ref={modalRef}
          schoolId={schoolId}
          createQueries={{ [key]: queryAddMutation }}
        />
      )}
    </Base>
  );
};

export default Classrooms;
