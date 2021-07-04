import { useRef, useMemo } from 'react';
import { useSession } from 'next-auth/client';
import { Edit3, X } from '@styled-icons/feather';

import ListItem from 'components/ListItem';
import Button from 'components/Button';
import GradeSchoolSubjectModal, {
  GradeSchoolSubjectModalRef
} from 'components/GradeSchoolSubjectModal';

import { useAccess } from 'hooks/AccessProvider';

import { GradeSchoolSubject } from 'models/GradeSchoolSubject';

import { useListGradeSchoolSubjects } from 'requests/queries/grade-school-subjects';
import { useDeleteGradeSchoolSubject } from 'requests/mutations/grade-school-subject';

import * as S from './styles';

type GradeSchoolSubjectsCardProps = {
  gradeId?: string;
  schoolYearId?: string;
};

const GradeSchoolSubjectsCard = ({
  gradeId,
  schoolYearId
}: GradeSchoolSubjectsCardProps) => {
  const modalRef = useRef<GradeSchoolSubjectModalRef>(null);

  const { enableAccess } = useAccess();

  const [session] = useSession();
  const { data, isLoading, refetch } = useListGradeSchoolSubjects(session, {
    grade_id: gradeId,
    school_year_id: schoolYearId
  });
  const deleteGradeSchoolSubjectMutation = useDeleteGradeSchoolSubject();

  const handleRemove = async (gradeSchoolSubject: GradeSchoolSubject) => {
    const confirm = window.confirm(
      `Deseja remover a disciplina ${gradeSchoolSubject.school_subject?.description}?`
    );

    if (confirm) {
      await deleteGradeSchoolSubjectMutation.mutateAsync(gradeSchoolSubject);
      refetch();
    }
  };

  const canChangeGradeSchoolSubject = useMemo(
    () => enableAccess({ module: 'GRADE_SCHOOL_SUBJECT', rule: 'WRITE' }),
    [enableAccess]
  );

  return (
    <S.Wrapper>
      <S.Section>
        <S.SectionTitle>
          <h4>Disciplinas</h4>
          {gradeId && data && (
            <Button
              module="GRADE_SCHOOL_SUBJECT"
              rule="WRITE"
              size="small"
              onClick={() => modalRef.current?.openModal()}
            >
              Adicionar disciplina
            </Button>
          )}
        </S.SectionTitle>
        {gradeId ? (
          <S.ListSection>
            {data ? (
              <>
                {data.length ? (
                  <S.List>
                    {data.map((item) => (
                      <ListItem key={item.id}>
                        <S.ItemContent>
                          <span>
                            {item.school_subject?.description}
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            {item.workload}h
                          </span>

                          {canChangeGradeSchoolSubject && (
                            <div>
                              <S.ActionButton
                                onClick={() =>
                                  modalRef.current?.openModal(item)
                                }
                              >
                                <Edit3 size={20} color="#0393BE" />
                              </S.ActionButton>
                              <S.ActionButton
                                onClick={() => handleRemove(item)}
                              >
                                <X />
                              </S.ActionButton>
                            </div>
                          )}
                        </S.ItemContent>
                      </ListItem>
                    ))}
                  </S.List>
                ) : (
                  <S.Message>
                    Ainda não temos nenhuma disciplina vinculada a essa série,
                    clique no botão &quot;Adicionar disciplina&quot; para
                    adicionar disciplinas
                  </S.Message>
                )}
              </>
            ) : (
              <>
                {isLoading ? (
                  <S.Message>Carregando...</S.Message>
                ) : (
                  <S.Message>
                    Não foi possível carregar as disciplinas
                  </S.Message>
                )}
              </>
            )}
          </S.ListSection>
        ) : (
          <S.Message>
            Selecione uma série para visualizar suas disciplinas
          </S.Message>
        )}
      </S.Section>
      <GradeSchoolSubjectModal
        gradeId={gradeId}
        schoolYearId={schoolYearId}
        refetchFn={refetch}
        ref={modalRef}
      />
    </S.Wrapper>
  );
};

export default GradeSchoolSubjectsCard;
