import { useRef, useMemo } from 'react';
import { useSession } from 'next-auth/client';
import { PlusCircle, X } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import Table from 'components/Table';
import TableColumn from 'components/TableColumn';
import ClassroomModal, { ClassroomModalRef } from 'components/ClassroomModal';

import { useAccess } from 'hooks/AccessProvider';

import { Classroom } from 'models/Classroom';
import { School } from 'models/School';

import { useListClassrooms } from 'requests/queries/classrooms';
import { useDeleteClassroom } from 'requests/mutations/classroom';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import * as S from './styles';

export type ClassroomsProps = {
  school: School;
};

const Classrooms = ({ school }: ClassroomsProps) => {
  const modalRef = useRef<ClassroomModalRef>(null);

  const { enableAccess } = useAccess();

  const [session] = useSession();

  const {
    data: classrooms,
    key,
    queryAddMutation,
    queryRemoveMutation
  } = useListClassrooms(session, {
    school_id: school.id
  });

  const deleteClassroomMutation = useDeleteClassroom({
    [key]: queryRemoveMutation
  });

  const handleAddClassroom = () => {
    modalRef.current?.openModal();
  };

  const handleDeleteClassroom = (classroom: Classroom) => {
    const confirmation = window.confirm(
      `Deseja apagar a turma ${classroom.description}?`
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
      {canChangeClassroom && (
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

      <S.TableSection>
        <S.SectionTitle>
          <h4>Turmas</h4>
        </S.SectionTitle>
        <Table<Classroom>
          items={classrooms || []}
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
            render={(classroom) => (
              <S.ActionButtons>
                <S.ActionDeleteButton
                  type="button"
                  title={`Excluir a turma ${classroom.description}`}
                  onClick={() => handleDeleteClassroom(classroom)}
                >
                  <X />
                </S.ActionDeleteButton>
              </S.ActionButtons>
            )}
          />
        </Table>
      </S.TableSection>
      <ClassroomModal
        ref={modalRef}
        schoolId={school.id}
        createQueries={{ [key]: queryAddMutation }}
      />
    </Base>
  );
};

export default Classrooms;
