import { useRef, useMemo } from 'react';
import { useSession } from 'next-auth/client';
import { X } from '@styled-icons/feather';

import Button from 'components/Button';
import ListItem from 'components/ListItem';
import AddTeacherToSchoolSubjectModal, {
  AddTeacherToSchoolSubjectModalRef
} from 'components/AddTeacherToSchoolSubjectModal';

import { useAccess } from 'hooks/AccessProvider';

import { TeacherSchoolSubject } from 'models/TeacherSchoolSubject';

import { useListTeacherSchoolSubjects } from 'requests/queries/teacher-school-subjects';
import { useDeleteTeacherSchoolSubject } from 'requests/mutations/teacher-school-subjects';

import * as S from './styles';

type TeacherSchoolSubjectCardProps = {
  schoolId: string;
  schoolSubjectId?: string;
};

const TeacherSchoolSubjectCard = ({
  schoolId,
  schoolSubjectId
}: TeacherSchoolSubjectCardProps) => {
  const modalRef = useRef<AddTeacherToSchoolSubjectModalRef>(null);

  const { enableAccess } = useAccess();

  const [session] = useSession();
  const {
    data: teacherSchoolSubjects,
    isLoading,
    refetch
  } = useListTeacherSchoolSubjects(session, {
    school_id: schoolId,
    school_subject_id: schoolSubjectId
  });

  const deleteTeacherSchoolSubject = useDeleteTeacherSchoolSubject();

  const handleRemove = async (teacherSchoolSubject: TeacherSchoolSubject) => {
    const confirm = window.confirm(
      `Deseja remover o professor ${teacherSchoolSubject.employee.person.name}?`
    );

    if (confirm) {
      await deleteTeacherSchoolSubject.mutateAsync(teacherSchoolSubject);
      refetch();
    }
  };

  const canChangeTeacherSchoolSubject = useMemo(
    () => enableAccess({ module: 'TEACHER_SCHOOL_SUBJECT', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <S.Wrapper>
      <S.Section>
        <S.SectionTitle>
          <h4>Professores</h4>
          {canChangeTeacherSchoolSubject &&
            schoolSubjectId &&
            teacherSchoolSubjects && (
              <Button
                size="small"
                onClick={() => modalRef.current?.openModal()}
              >
                Adicionar professor
              </Button>
            )}
        </S.SectionTitle>
        {schoolSubjectId ? (
          <S.ListSection>
            {teacherSchoolSubjects ? (
              <>
                {teacherSchoolSubjects.length ? (
                  <S.List>
                    {teacherSchoolSubjects.map((teacherSchoolSubject) => (
                      <ListItem key={teacherSchoolSubject.id}>
                        <S.ItemContent>
                          <span>
                            {teacherSchoolSubject.employee.person.name}
                          </span>

                          {canChangeTeacherSchoolSubject && (
                            <S.ActionButton
                              title={`Remover ${teacherSchoolSubject.employee.person.name}`}
                              onClick={() => handleRemove(teacherSchoolSubject)}
                            >
                              <X
                                title={`Remover ${teacherSchoolSubject.employee.person.name}`}
                              />
                            </S.ActionButton>
                          )}
                        </S.ItemContent>
                      </ListItem>
                    ))}
                  </S.List>
                ) : (
                  <S.Message>
                    Ainda não temos nenhum professor vinculado a essa
                    disciplina, clique no botão &quot;Adicionar professor&quot;
                    para vincular professores
                  </S.Message>
                )}
              </>
            ) : (
              <>
                {isLoading ? (
                  <S.Message>Carregando...</S.Message>
                ) : (
                  <S.Message>
                    Não foi possível carregar os professores
                  </S.Message>
                )}
              </>
            )}
          </S.ListSection>
        ) : (
          <S.Message>
            Selecione uma disciplina para visualizar seus professores
          </S.Message>
        )}
      </S.Section>

      {schoolSubjectId && (
        <AddTeacherToSchoolSubjectModal
          schoolId={schoolId}
          schoolSubjectId={schoolSubjectId}
          refetchFn={refetch}
          ref={modalRef}
        />
      )}
    </S.Wrapper>
  );
};

export default TeacherSchoolSubjectCard;
