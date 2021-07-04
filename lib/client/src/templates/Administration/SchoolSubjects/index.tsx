import { useRef, useMemo } from 'react';
import { useSession } from 'next-auth/client';
import { PlusCircle, Edit, X } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Button from 'components/Button';
import TableColumn from 'components/TableColumn';
import Table from 'components/Table';
import AddSchoolSubjectModal, {
  SchoolSubjectModalRef
} from 'components/AddSchoolSubjectModal';

import { useAccess } from 'hooks/AccessProvider';

import { SchoolSubject } from 'models/SchoolSubject';

import { useListSchoolsSubjects } from 'requests/queries/school-subjects';
import { useDeleteSchoolSubjectMutation } from 'requests/mutations/school-subjects';

import * as S from './styles';

const SchoolSubjects = () => {
  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data: schoolSubjects, refetch } = useListSchoolsSubjects(session);

  const modalRef = useRef<SchoolSubjectModalRef>(null);
  const handleOpenModal = () => {
    modalRef.current?.openModal();
  };

  const mutation = useDeleteSchoolSubjectMutation(session);
  const handleDelete = async (schoolSubject: SchoolSubject) => {
    const confirmation = window.confirm(
      `Deseja excluir a disciplina ${schoolSubject.description}?`
    );
    if (confirmation) {
      await mutation.mutateAsync(schoolSubject);
      refetch();
    }
  };

  const canChangeSchoolSubjects = useMemo(
    () => enableAccess({ module: 'SCHOOL-SUBJECT', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <Base>
      <Heading>Disciplinas</Heading>
      {canChangeSchoolSubjects && (
        <S.AddButtonContainer>
          <Button
            styleType="normal"
            size="medium"
            icon={<PlusCircle />}
            onClick={handleOpenModal}
          >
            Adicionar Disciplinas
          </Button>
        </S.AddButtonContainer>
      )}

      <S.TableSection>
        <S.SectionTitle>
          <h4>Disciplinas</h4>
        </S.SectionTitle>
      </S.TableSection>
      <Table items={schoolSubjects || []} keyExtractor={(item) => item.id}>
        <TableColumn label="Nome" tableKey="description" />
        <TableColumn
          label="Descrição da disciplina"
          tableKey="additional_description"
          ellipsis
        />
        <TableColumn
          label="Ações"
          tableKey="id"
          contentAlign="center"
          actionColumn
          module="SCHOOL-SUBJECT"
          rule="WRITE"
          render={(schoolSubject) => (
            <S.ActionButtons>
              <S.ActionEditButton
                type="button"
                title={`Alterar a disciplina ${schoolSubject.description}`}
                onClick={() => modalRef.current?.openModal(schoolSubject)}
              >
                <Edit
                  title={`Alterar a disciplina ${schoolSubject.description}`}
                />
              </S.ActionEditButton>
              <S.ActionDeleteButton
                type="button"
                title={`Excluir a disciplina ${schoolSubject.description}`}
                onClick={() => handleDelete(schoolSubject)}
              >
                <X />
              </S.ActionDeleteButton>
            </S.ActionButtons>
          )}
        />
      </Table>
      <AddSchoolSubjectModal refetchFn={refetch} ref={modalRef} />
    </Base>
  );
};

export default SchoolSubjects;
